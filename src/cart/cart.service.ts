import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Cart } from './entities/cart.entity'
import { CreateCartDto } from './dto/cart-create.dto'

import { CartItem } from './entities/cart-item.entity'
import { CartItemCreateDto } from './dto/cart-item-create.dto'
import { UpdateCartDto } from './dto/cart-update.dto'
import { CartItemAmountDto } from './dto/cart-item-amount.dto'
import { CartData, CartItemResponse } from './types/cart.types'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { LANG } from 'src/common/enums/translation.enum'
import { CartItemCommentDto } from './dto/cart-item-comment'
import { CartDetails } from './entities/cart-details.entity'
import { CartDetailsUpdateDto } from './dto/cart-details-update.dto'
import { getTotalAndAmount } from './utils/cart.utils'
import { User } from 'src/user/entities/user.entity'
import { CartUpdateUserDto } from './dto/cart-update-user.dto'
import { CartDeliveryTimeDto } from './dto/cart-delivery-time.dto'
import { ProductService } from 'src/product/product.service'
import { ProductWithoutRatings } from 'src/common/utils/apply-rating'
import { SettingsService } from 'src/settings/settings.service'

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name)

  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(CartDetails)
    private cartDetailsRepo: Repository<CartDetails>,
    private productService: ProductService,
    private settingsService: SettingsService
  ) {}

  async getCart(session_id: string, lang: LANG): Promise<CartData> {
    const cart: Cart | null = await this.cartRepo.findOne({
      where: { session_id },
      relations: [
        'user_id',
        'details',
        'cart_items',
        'cart_items.product_id',
        'cart_items.product_id.nomenclature_id',
        'cart_items.product_id.nomenclature_id.price_id',
        'cart_items.product_id.nomenclature_id.price_id.price_type_id',
        'cart_items.product_id.nomenclature_id.segment_id',
        'cart_items.product_id.nomenclature_id.segment_id.discount_ids',
        'cart_items.product_id.nomenclature_id.segment_id.discount_ids.discount_conditions',
        'cart_items.product_id.brand_id',
        'cart_items.product_id.category_id',
        'cart_items.product_id.category_id.translates',
        'cart_items.product_id.measurement_id',
        'cart_items.product_id.measurement_id.translates',
        'cart_items.product_id.parameters',
        'cart_items.product_id.parameters.translates',
        'cart_items.product_id.promotion_id',
        'cart_items.product_id.promotion_id.translates',
        'cart_items.product_id.images',
        'cart_items.product_id.stock'
      ]
    })

    if (cart === null) {
      return {
        cart: null,
        amount: 0,
        total: '0.00',
        weightKg: 0
      }
    }

    if (cart.cart_items?.length) {
      const products = cart.cart_items.map((item) => item.product_id)
      let translatedProducts = applyTranslations(products, lang)

      translatedProducts = translatedProducts.map((product) => {
        if (product.category_id && product.category_id.translates) {
          product.category_id = applyTranslations(
            [product.category_id],
            lang
          )[0]
        }
        if (product.measurement_id && product.measurement_id.translates) {
          product.measurement_id = applyTranslations(
            [product.measurement_id],
            lang
          )[0]
        }
        if (product.promotion_id && product.promotion_id.translates) {
          product.promotion_id = applyTranslations(
            [product.promotion_id],
            lang
          )[0]
        }
        if (product.parameters && Array.isArray(product.parameters)) {
          product.parameters = applyTranslations(product.parameters, lang)
        }
        return product
      })

      const newCartItems: CartItemResponse[] = []

      for (let idx = 0; idx < cart.cart_items.length; idx++) {
        const item = cart.cart_items[idx]
        const product = translatedProducts[idx]

        let unavailable = false
        let recomended_to_swap: CartItemResponse['recomended_to_swap'] = []

        try {
          const requestedAmount = Number(item.amount) || 0
          const availableAmount =
            product && product.stock ? Number(product.stock.amount) || 0 : 0

          unavailable = requestedAmount > 0 && availableAmount < requestedAmount

          if (unavailable && product.category_id) {
            try {
              const replacements =
                await this.productService.findReplacementProducts(
                  [product.category_id.id],
                  lang,
                  10
                )
              recomended_to_swap = replacements
            } catch (err) {
              this.logger.warn(
                `Failed to fetch replacements for cart item ${item.id}: ${err}`
              )
              recomended_to_swap = []
            }
          }
        } catch (err) {
          this.logger.warn(
            `Error while computing availability for cart item ${item.id}: ${err}`
          )
          unavailable = false
          recomended_to_swap = []
        }

        const responseItem: CartItemResponse = {
          ...item,
          product_id: product,
          unavailable,
          recomended_to_swap
        }

        newCartItems.push(responseItem)
      }

      const typedCart: Omit<Cart, 'cart_items'> & {
        cart_items?: CartItemResponse[]
      } = {
        ...cart,
        cart_items: newCartItems
      }

      const { total, amount, weightKg } = getTotalAndAmount(
        typedCart as unknown as Cart
      )

      return {
        amount,
        total,
        weightKg,
        cart: typedCart as Cart & { cart_items?: CartItemResponse[] }
      }
    }
    const { total, amount, weightKg } = getTotalAndAmount(cart)

    return {
      amount,
      total,
      weightKg,
      cart
    }
  }

  async getCartWithMinimalPrice(
    session_id: string,
    lang: LANG
  ): Promise<CartData & { minimalOrderPrice: number }> {
    const cartData = await this.getCart(session_id, lang)
    const minimalOrderPriceData =
      await this.settingsService.getMinimalOrderPrice()

    return {
      ...cartData,
      minimalOrderPrice: minimalOrderPriceData.price
    }
  }

  async createCart(dto: CreateCartDto, session_id: string): Promise<Cart> {
    const { user_id } = dto

    const cartExist = await this.cartRepo.findOne({ where: { session_id } })

    if (cartExist)
      throw new BadRequestException('Cart for this session_id is ALREADY_EXIST')

    const newCart = this.cartRepo.create({ session_id, user_id })

    let cart: Cart | null = null

    try {
      cart = await this.cartRepo.save(newCart)
    } catch (err) {
      this.logger.error(`Error while creating cart: ${err}`)
      throw new BadRequestException('NOT_CREATED')
    }

    if (cart?.id) {
      const { coords, delivery_type, meta_data } = dto

      const cartDetails = this.cartDetailsRepo.create({
        cart_id: { id: cart.id },
        coords,
        delivery_type,
        meta_data
      })

      try {
        await this.cartDetailsRepo.save(cartDetails)
      } catch (err) {
        this.logger.error(
          `Error to create cart details for cart with id ${cart?.id} \n ${err}`
        )
      }
    }

    return cart
  }

  async updateUserOfCart(dto: CartUpdateUserDto) {
    const { session_id, user_id } = dto

    const cartExist = await this.cartRepo.findOne({
      where: { session_id },
      relations: ['user_id']
    })

    if (cartExist && user_id) {
      const user = await this.userRepo.findOne({ where: { id: user_id } })
      if (!user) {
        this.logger.debug('User NOT_FOUND with provided id')
        return
      }

      const previousUserId = cartExist.user_id?.id
      cartExist.user_id = user

      await this.cartRepo.save(cartExist)

      if (previousUserId && previousUserId !== user_id) {
        this.logger.debug(
          `Updated cart user_id for session ${session_id} from user ${previousUserId} to user ${user_id} (account switch)`
        )
      } else if (!previousUserId) {
        this.logger.debug(
          `Updated cart user_id for session ${session_id} to user ${user_id} (first login)`
        )
      } else {
        this.logger.debug(
          `Cart user_id for session ${session_id} confirmed as user ${user_id}`
        )
      }
    }
  }

  async updateCart(
    dto: UpdateCartDto,
    session_id: string,
    lang: LANG
  ): Promise<CartData> {
    const { user_id, ...cartDetails } = dto

    if (user_id && typeof user_id === 'number') {
      const userExist = await this.userRepo.findOne({ where: { id: user_id } })

      if (!userExist)
        throw new NotFoundException('User NOT_FOUND with provided id')
    }

    const shoppingCart = await this.cartRepo.findOne({
      where: { session_id },
      relations: ['details']
    })

    if (shoppingCart) {
      await this.cartRepo.update({ session_id }, { user_id })

      const details_id = shoppingCart?.details?.id

      if (details_id && cartDetails) {
        await this.cartDetailsRepo.update({ id: details_id }, cartDetails)
      }

      return await this.getCart(session_id, lang)
    } else {
      this.logger.warn(
        `Cart not found with session_id ${session_id} when trying to update cart`
      )
      throw new BadRequestException('NOT_FOUND')
    }
  }

  async updateCartDetails(
    id: number,
    dto: CartDetailsUpdateDto
  ): Promise<CartDetails | null> {
    const { cart_id, ...cartDetails } = dto

    const entity = await this.cartDetailsRepo.findOne({ where: { id } })

    if (!entity) throw new NotFoundException()

    await this.cartDetailsRepo.update(
      { id },
      { cart_id: { id: cart_id }, ...cartDetails }
    )

    return await this.cartDetailsRepo.findOne({ where: { id } })
  }

  async createCartItems(dto: CartItemCreateDto, cartId: number) {
    const {
      product_id,
      amount,
      bundle_id,
      parent_bundle_id,
      custom_id,
      comment
    } = dto

    if (parent_bundle_id && +bundle_id) {
      this.logger.error(
        "This product can't be a bundle and belong to bundle at same time"
      )
      throw new BadRequestException('BUNDLE_CANT_BE_BELONG_TO_BUNDLE')
    }
    if (product_id === +bundle_id) {
      this.logger.error("This product can't be a bundle of itself")
      throw new BadRequestException('CANT_BE_BUNDLE_OF_ITSELF')
    }

    try {
      const whereConditions: any = {
        cart_id: { id: cartId },
        product_id: { id: product_id }
      }

      if (custom_id !== undefined) {
        whereConditions.custom_id = custom_id
      }
      if (bundle_id !== undefined) {
        whereConditions.bundle_id = bundle_id
      }
      if (parent_bundle_id !== undefined) {
        whereConditions.parent_bundle_id = parent_bundle_id
      }

      const existingItem = await this.cartItemRepo.findOne({
        where: whereConditions
      })

      if (existingItem) {
        const currentAmount = parseFloat(existingItem.amount)
        const newAmount = parseFloat(amount)
        const totalAmount = (currentAmount + newAmount).toFixed(3)

        existingItem.amount = totalAmount

        if (comment) {
          existingItem.comment = comment
        }

        return await this.cartItemRepo.save(existingItem)
      } else {
        const data = {
          custom_id,
          product_id: { id: product_id },
          amount: amount,
          parent_bundle_id,
          bundle_id,
          comment,
          cart_id: { id: cartId }
        }

        const newCartItem = this.cartItemRepo.create(data)
        return await this.cartItemRepo.save(newCartItem)
      }
    } catch (err) {
      this.logger.error(`Error to create/update cart item \n ${err}`)
      throw new BadRequestException('cart item is NOT_CREATED')
    }
  }

  async addItem(
    dto: CartItemCreateDto[],
    session_id: string
  ): Promise<CartData> {
    const shoppingCart = await this.cartRepo.findOne({ where: { session_id } })

    let cart: Cart | null = null

    if (!shoppingCart) {
      throw new NotFoundException('NOT_FOUND')
    } else {
      cart = await this.cartRepo.findOne({ where: { session_id } })
    }

    if (cart) {
      for (const product of dto) {
        await this.createCartItems(product, cart.id)
      }

      return await this.getCart(session_id, LANG.UA)
    } else {
      this.logger.warn(`Cart has not been found for session_id ${session_id}`)
      throw new NotFoundException(
        `cart is NOT_FOUND for session_id ${session_id}`
      )
    }
  }

  async updateCartItemAmount(
    dto: CartItemAmountDto,
    session_id: string
  ): Promise<CartData> {
    const { id, amount } = dto

    try {
      await this.cartItemRepo.update(id, { amount })
    } catch (err) {
      this.logger.error(
        `Error to update cartItem with id ${id} in cart with session_id ${session_id} \n ${err}`
      )
      throw new BadRequestException('cart item is NOT_UPDATED')
    }

    return await this.getCart(session_id, LANG.UA)
  }

  async updateCartItemComment(
    dto: CartItemCommentDto,
    session_id: string,
    lang: LANG
  ): Promise<CartData> {
    const { comment, id } = dto

    try {
      const result = await this.cartItemRepo.update(id, { comment })

      if (result.affected === 0)
        throw new NotFoundException('cart item is NOT_FOUND')
    } catch (err) {
      this.logger.error(
        `Error to update cartItem comment with id ${id} in cart with session_id ${session_id} \n ${err}`
      )
      throw new BadRequestException('cart item is NOT_UPDATED')
    }

    return await this.getCart(session_id, lang)
  }

  async deleteItem(
    id: number,
    session_id: string,
    lang: LANG
  ): Promise<CartData | BadRequestException> {
    const shoppingCart = await this.cartRepo.findOne({ where: { session_id } })

    if (shoppingCart) {
      const cartItem = await this.cartItemRepo.findOne({
        where: { id },
        relations: ['product_id']
      })

      if (!cartItem) {
        throw new NotFoundException('Cart item NOT_FOUND')
      }

      await this.cartItemRepo.delete(id)
      return await this.getCart(session_id, lang)
    } else {
      this.logger.warn(
        `Cart not found for session_id ${session_id} when trying to delete item with id ${id}`
      )
      throw new BadRequestException(
        'session_id is NOT_FOUND while deleting cart item'
      )
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    const image = await this.cartRepo.findOne({ where: { id } })

    if (!image) throw new NotFoundException('cart item is NOT_FOUND')

    try {
      await this.cartRepo.delete(id)
    } catch (err) {
      this.logger.error(`Error deleting cart with id ${id}: ${err}`)
      throw new BadRequestException('cart item is NOT_DELETED')
    }

    return { message: 'SUCCESS' }
  }

  async updateDeliveryTime(
    dto: CartDeliveryTimeDto,
    session_id: string,
    lang: LANG
  ): Promise<CartData> {
    const { date, timeSlot } = dto

    const shoppingCart = await this.cartRepo.findOne({
      where: { session_id },
      relations: ['details']
    })

    if (!shoppingCart) {
      throw new NotFoundException('Cart NOT_FOUND')
    }

    const details_id = shoppingCart?.details?.id

    if (details_id) {
      let currentMetaData = {}
      try {
        if (shoppingCart.details.meta_data) {
          currentMetaData = JSON.parse(shoppingCart.details.meta_data)
        }
      } catch (err) {
        this.logger.warn(`Failed to parse existing meta_data: ${err}`)
        currentMetaData = {}
      }

      const updatedMetaData = {
        ...currentMetaData,
        deliveryTime: {
          date,
          timeSlot
        }
      }

      try {
        await this.cartDetailsRepo.update(
          { id: details_id },
          { meta_data: JSON.stringify(updatedMetaData) }
        )
      } catch (err) {
        this.logger.error(
          `Error updating delivery time for cart with session_id ${session_id}: ${err}`
        )
        throw new BadRequestException('Failed to update delivery time')
      }
    } else {
      this.logger.warn(
        `Cart details not found for cart with session_id ${session_id}`
      )
      throw new BadRequestException('Cart details NOT_FOUND')
    }

    return await this.getCart(session_id, lang)
  }

  async clearCart(session_id: string, lang: LANG): Promise<CartData> {
    const cart = await this.cartRepo.findOne({
      where: { session_id },
      relations: ['cart_items']
    })

    if (!cart) {
      throw new NotFoundException('Cart NOT_FOUND')
    }

    if (cart.cart_items && cart.cart_items.length > 0) {
      try {
        await this.cartItemRepo.delete({ cart_id: { id: cart.id } })
      } catch (err) {
        this.logger.error(
          `Error clearing cart items for session_id ${session_id}: ${err}`
        )
        throw new BadRequestException('Failed to clear cart items')
      }
    }

    return await this.getCart(session_id, lang)
  }

  async getRecommendedProducts(
    session_id: string,
    lang: LANG
  ): Promise<ProductWithoutRatings[]> {
    const cart = await this.cartRepo.findOne({
      where: { session_id },
      relations: ['cart_items', 'cart_items.product_id']
    })

    if (!cart || !cart.cart_items?.length) {
      return []
    }

    const productIds = cart.cart_items.map((item) => item.product_id.id)

    try {
      const recommendedProducts = await this.productService.findRecommended(
        productIds,
        lang
      )

      return recommendedProducts.slice(0, 10)
    } catch (err) {
      this.logger.error(
        `Error fetching recommended products for session_id ${session_id}: ${err}`
      )
      return []
    }
  }

  async getUnavailableItems(
    session_id: string,
    lang: LANG
  ): Promise<{
    unavailableItems: any[]
    replacementProducts: ProductWithoutRatings[]
  }> {
    const cart = await this.cartRepo.findOne({
      where: { session_id },
      relations: [
        'cart_items',
        'cart_items.product_id',
        'cart_items.product_id.stock',
        'cart_items.product_id.category_id'
      ]
    })

    if (!cart || !cart.cart_items?.length) {
      return { unavailableItems: [], replacementProducts: [] }
    }

    const unavailableItems: any[] = []
    const categoryIds: number[] = []

    for (const cartItem of cart.cart_items) {
      const product = cartItem.product_id
      const requestedAmount = parseFloat(cartItem.amount)
      const availableAmount = product.stock
        ? parseFloat(product.stock.amount.toString())
        : 0

      if (availableAmount < requestedAmount) {
        unavailableItems.push({
          cartItem,
          requestedAmount,
          availableAmount
        })

        if (product.category_id) {
          categoryIds.push(product.category_id.id)
        }
      }
    }

    let replacementProducts: ProductWithoutRatings[] = []

    if (unavailableItems.length > 0 && categoryIds.length > 0) {
      try {
        replacementProducts = await this.productService.findReplacementProducts(
          categoryIds,
          lang,
          10
        )
      } catch (err) {
        this.logger.error(
          `Error fetching replacement products for session_id ${session_id}: ${err}`
        )
      }
    }

    return { unavailableItems, replacementProducts }
  }

  async replaceUnavailableItem(
    session_id: string,
    unavailableItemId: number,
    replacementProductId: number,
    lang: LANG
  ): Promise<CartData> {
    const cart = await this.cartRepo.findOne({
      where: { session_id },
      relations: ['cart_items']
    })

    if (!cart) {
      throw new NotFoundException('Cart NOT_FOUND')
    }

    // Знаходимо товар який потрібно замінити
    const cartItemToReplace = cart.cart_items.find(
      (item) => item.id === unavailableItemId
    )

    if (!cartItemToReplace) {
      throw new NotFoundException('Cart item NOT_FOUND')
    }

    try {
      // Видаляємо недоступний товар
      await this.cartItemRepo.delete(unavailableItemId)

      // Додаємо товар заміни з тією ж кількістю
      await this.createCartItems(
        {
          product_id: replacementProductId,
          amount: cartItemToReplace.amount,
          comment: cartItemToReplace.comment || '',
          bundle_id: cartItemToReplace.bundle_id,
          parent_bundle_id: cartItemToReplace.parent_bundle_id,
          custom_id: cartItemToReplace.custom_id || ''
        },
        cart.id
      )

      return await this.getCart(session_id, lang)
    } catch (err) {
      this.logger.error(
        `Error replacing unavailable item for session_id ${session_id}: ${err}`
      )
      throw new BadRequestException('Failed to replace unavailable item')
    }
  }
}
