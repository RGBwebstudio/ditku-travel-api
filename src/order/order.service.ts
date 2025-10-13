import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Order } from './entities/order.entity'
import { Repository } from 'typeorm'
import { CartService } from 'src/cart/cart.service'
import { LANG } from 'src/common/enums/translation.enum'
import { OrderStatus } from 'src/common/enums/order.enum'
import { User } from 'src/user/entities/user.entity'
import { OrderDetails } from './entities/order-details.entity'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderItem } from './entities/order-item.entity'
import { GetUserOrdersDto } from '../user/dto/get-user-orders.dto'
import { Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm'
import { Product } from 'src/product/entities/product.entity'
import { CreateOrderItemDto } from './dto/create-order-item.dto'
import { UpdateOrderDetailsDto } from './dto/update-order-details.dto'

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name)

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderDetails)
    private orderDetailsRepo: Repository<OrderDetails>,
    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private cartService: CartService
  ) {}

  async getOrder(id: number): Promise<Order | null> {
    const entity = await this.orderRepo.findOne({
      where: { id },
      relations: ['user_id', 'details', 'products', 'products.product_id']
    })
    return entity
  }

  async getOrders(
    take: number,
    skip: number,
    status?: string
  ): Promise<{ entities: Order[]; count: number }> {
    const where: any = {}

    if (status) {
      where.status = status === 'all' ? undefined : status
    }

    const [orders, count] = await this.orderRepo.findAndCount({
      where: Object.keys(where).length > 0 ? where : undefined,
      take,
      skip,
      relations: ['user_id', 'details', 'products', 'products.product_id']
    })
    return { entities: orders, count }
  }

  async searchOrders(q: string): Promise<Order[]> {
    if (!q || q.trim() === '') return []

    if (/^[0-9]+$/.test(q)) {
      const id = Number(q)
      const order = await this.getOrder(id)
      return order ? [order] : []
    }

    const digits = q.replace(/[^\d]/g, '')
    if (digits.length < 3) return []

    const phoneParam = `%${digits}%`

    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user_id', 'user')
      .leftJoinAndSelect('order.details', 'details')
      .leftJoinAndSelect('order.products', 'products')

    const orders = await qb
      .where(
        "user.phone LIKE :phone OR details.meta_data->'recipientInfo'->>'phone' LIKE :phone",
        { phone: phoneParam }
      )
      .getMany()

    return orders
  }

  async getUserOrders(
    id: number,
    take: number,
    skip: number
  ): Promise<{ entities: Order[]; count: number }> {
    const userExist = await this.userRepo.findOne({ where: { id } })

    if (!userExist)
      throw new NotFoundException('User with this id is NOT_FOUND')

    const [orders, count] = await this.orderRepo.findAndCount({
      where: { user_id: { id } },
      take,
      skip,
      relations: ['user_id', 'details', 'products', 'products.product_id']
    })
    return { entities: orders, count }
  }

  async getUserOrdersWithFilters(
    id: number,
    dto: GetUserOrdersDto
  ): Promise<{ entities: Order[]; count: number }> {
    const userExist = await this.userRepo.findOne({ where: { id } })

    if (!userExist)
      throw new NotFoundException('User with this id is NOT_FOUND')

    const { take, skip, status, dateFrom, dateTo } = dto

    const whereConditions: any = { user_id: { id } }

    if (status) {
      whereConditions.status = status
    }

    const parseDate = (dateStr: string): Date => {
      const [day, month, year] = dateStr.split('.')
      const fullYear =
        parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year)
      return new Date(fullYear, parseInt(month) - 1, parseInt(day))
    }

    if (dateFrom && dateTo) {
      const fromDate = parseDate(dateFrom)
      const toDate = parseDate(dateTo)
      toDate.setHours(23, 59, 59, 999)
      whereConditions.created_at = Between(fromDate, toDate)
    } else if (dateFrom) {
      const fromDate = parseDate(dateFrom)
      whereConditions.created_at = MoreThanOrEqual(fromDate)
    } else if (dateTo) {
      const toDate = parseDate(dateTo)
      toDate.setHours(23, 59, 59, 999)
      whereConditions.created_at = LessThanOrEqual(toDate)
    }

    const [orders, count] = await this.orderRepo.findAndCount({
      where: whereConditions,
      take,
      skip,
      order: { created_at: 'DESC' },
      relations: ['user_id', 'details', 'products', 'products.product_id']
    })
    return { entities: orders, count }
  }

  async createOrder(dto: CreateOrderDto, session_id: string, lang: LANG) {
    const shoppingCart = await this.cartService.getCart(session_id, lang)

    if (!shoppingCart?.cart) {
      throw new BadRequestException('СART_IS_NOT_CREATED')
    }

    const user_id = shoppingCart.cart.user_id
    const total = shoppingCart.total
    const products = shoppingCart.cart.cart_items

    if (!products || !Array.isArray(products) || products.length === 0) {
      throw new BadRequestException('CART_IS_EMPTY')
    }

    for (const cartItem of products) {
      try {
        const requestedAmount = Number(cartItem.amount) || 0
        const availableAmount =
          cartItem.product_id && cartItem.product_id.stock
            ? Number(cartItem.product_id.stock.amount) || 0
            : 0

        if (availableAmount < requestedAmount) {
          this.logger.warn(
            `Order can't be created - insufficient stock for product ${cartItem.product_id?.id || 'unknown'}`
          )

          throw new BadRequestException({
            message:
              'Insufficient stock for some items in cart ORDER_CANT_BE_CREATED'
          })
        }
      } catch (err) {
        if (err instanceof BadRequestException) throw err
        this.logger.warn(
          `Failed to validate stock for cart item ${cartItem?.id}: ${err}`
        )
      }
    }

    let order: Order | null = null

    const newOrder = this.orderRepo.create({
      custom_id: '',
      status: OrderStatus.NEW,
      user_id,
      total
    })

    let orderData: Order | null

    try {
      orderData = await this.orderRepo.save(newOrder)
    } catch (err) {
      this.logger.error(`Error create order: ${err.message || err}`)
      throw new BadRequestException('Order is NOT_CREATED')
    }

    const order_id: number = orderData.id

    const details = this.orderDetailsRepo.create({
      order_id: { id: order_id },
      payment_link: '',
      payment_id: '',
      is_paid: false,
      payment_link_created_at: null,
      receipt_url: '',
      ...dto
    })

    try {
      await this.orderDetailsRepo.save(details)
    } catch (err) {
      this.logger.error(
        `Error to save order details for order with id ${order_id} \n ${err}`
      )
    }

    for (const product of products) {
      const { custom_id, amount } = product
      const { price, measurement_id, id } = product.product_id

      const orderItem = this.orderItemRepo.create({
        custom_id,
        amount,
        measurement: JSON.stringify(measurement_id),
        product_id: { id },
        order_id: { id: order_id },
        price: String(parseFloat(price))
      })

      try {
        await this.orderItemRepo.save(orderItem)
        await this.productRepo.increment({ id }, 'popular_count', 1)
      } catch (err) {
        this.logger.error(
          `Order item is not created for order with id ${order_id} \n ${err}`
        )
      }
    }

    order = await this.getOrder(order_id)

    if (order && shoppingCart?.cart?.session_id) {
      await this.cartService.clearCart(shoppingCart.cart.session_id, lang)
    }

    return order
  }

  async updateStatus(id: number, status: OrderStatus) {
    try {
      await this.orderRepo.update(id, { status })
    } catch (err) {
      throw new BadRequestException(
        `Status of order with id ${id} is NOT_UPDATED \n ${err}`
      )
    }

    const updatedOrder = await this.orderRepo.findOne({ where: { id } })
    if (!updatedOrder)
      throw new NotFoundException(`Order with id ${id} is NOT_FOUND`)

    return updatedOrder
  }

  async checkUserProductPurchase(productId: number, req: any) {
    try {
      const order = await this.orderItemRepo
        .createQueryBuilder('order_item')
        .innerJoin('order_item.order_id', 'order')
        .innerJoin('order_item.product_id', 'product')
        .where('order.user_id = :userId', { userId: req.user.id })
        .andWhere('product.id = :productId', { productId })
        .andWhere('order.status = :successStatus', {
          successStatus: OrderStatus.SUCCESS
        })
        .getOne()

      return {
        hasPurchased: !!order,
        productId: productId
      }
    } catch (error) {
      this.logger.error(`Error checking user product purchase: ${error}`)
      throw new BadRequestException('BAD_REQUEST')
    }
  }

  async directCreateOrder(dto: CreateOrderDto) {
    let meta: any = {}
    try {
      meta = JSON.parse(dto.meta_data || '{}')
    } catch (err) {
      this.logger.error(
        `Error while parse JSON of order meta_data in directCreateOrder method`,
        err
      )
    }

    const user_id = meta.user_id ?? null
    const total = meta.total || '0.00'

    // Allow creating orders without a user (direct-create), user_id can be null
    const newOrderData: any = {
      custom_id: dto.custom_id || '',
      status: OrderStatus.NEW,
      total
    }

    if (user_id !== null && user_id !== undefined) {
      newOrderData.user_id = { id: user_id }
    } else {
      newOrderData.user_id = null
    }

    const newOrder = this.orderRepo.create(newOrderData)

    let orderData: Order
    try {
      const saved: unknown = await this.orderRepo.save(newOrder)
      orderData = saved as Order
    } catch (err) {
      this.logger.error(`Error create order: ${err.message || err}`)
      throw new BadRequestException('Order is NOT_CREATED')
    }
    if (!orderData || !orderData.id) {
      this.logger.error(
        `Order save returned invalid result: ${JSON.stringify(orderData)}`
      )
      throw new BadRequestException('Order is NOT_CREATED')
    }

    const details = this.orderDetailsRepo.create({
      order_id: { id: orderData.id },
      payment_type: dto.payment_type,
      payment_id: '',
      payment_link: '',
      payment_link_created_at: null,
      is_paid: false,
      receipt_url: '',
      meta_data: dto.meta_data || '{}',
      custom_id: ''
    })
    try {
      await this.orderDetailsRepo.save(details)
    } catch (err) {
      this.logger.error(
        `Error to save order details for order with id ${orderData.id} \n ${err}`
      )
    }

    return orderData
  }

  async addOrderItem(dto: CreateOrderItemDto) {
    const orderItem = this.orderItemRepo.create({
      custom_id: dto.custom_id || '',
      amount: String(Number.parseFloat(dto.amount)),
      measurement: JSON.stringify(dto.measurement),
      product_id: { id: dto.product_id },
      order_id: { id: dto.order_id },
      price: dto.price
    })

    try {
      const saved = await this.orderItemRepo.save(orderItem)

      await this.productRepo.increment(
        { id: dto.product_id },
        'popular_count',
        1
      )

      const orderItems = await this.orderItemRepo.find({
        where: { order_id: { id: dto.order_id } }
      })
      const newTotal = orderItems.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.amount),
        0
      )
      await this.orderRepo.update(dto.order_id, { total: newTotal.toFixed(2) })

      return saved
    } catch (err) {
      this.logger.error(
        `Order item is not created for order with id ${dto.order_id} \n ${err}`
      )

      throw new BadRequestException('OrderItem is NOT_CREATED')
    }
  }

  async updateOrderDetails(id: number, dto: UpdateOrderDetailsDto) {
    const details = await this.orderDetailsRepo.findOne({
      where: { id },
      relations: ['order_id']
    })

    if (!details) throw new NotFoundException('OrderDetails is NOT_FOUND')

    Object.assign(details, { meta_data: dto.meta_data, is_paid: dto.is_paid })

    if (details.order_id?.id) {
      try {
        await this.updateStatus(details.order_id.id, dto.status)
      } catch (err) {
        this.logger.error(`Error to update order status and is_paid \n ${err}`)
      }
    }

    try {
      return await this.orderDetailsRepo.save(details)
    } catch (err) {
      this.logger.error(`OrderDetails is not updated for id ${id} \n ${err}`)
      throw new BadRequestException('OrderDetails is NOT_UPDATED')
    }
  }

  async removeOrderItem(order_item_id: number) {
    const item = await this.orderItemRepo.findOne({
      where: { id: order_item_id },
      relations: ['order_id']
    })

    if (!item) {
      throw new NotFoundException('OrderItem is NOT_FOUND')
    }
    try {
      await this.orderItemRepo.delete(order_item_id)

      if (item.order_id && item.order_id.id) {
        const orderItems = await this.orderItemRepo.find({
          where: { order_id: { id: item.order_id.id } }
        })

        const newTotal = orderItems.reduce(
          (sum, it) => sum + Number(it.price) * Number(it.amount),
          0
        )

        try {
          await this.orderRepo.update(item.order_id.id, {
            total: newTotal.toFixed(2)
          })
        } catch (err) {
          this.logger.error(
            `Order total is not updated for order id ${item.order_id.id} \n ${err}`
          )
        }
      }

      return { success: true, id: order_item_id }
    } catch (err) {
      this.logger.error(
        `Order item is not deleted for id ${order_item_id} \n ${err}`
      )

      throw new BadRequestException('OrderItem is NOT_DELETED')
    }
  }

  async deleteOrder(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['details']
    })
    if (!order) {
      throw new NotFoundException('Order is NOT_FOUND')
    }
    try {
      await this.orderRepo.delete(id)

      return { success: true, id }
    } catch (err) {
      this.logger.error(`Order is not deleted for id ${id} \n ${err}`)
      throw new BadRequestException('Order is NOT_DELETED')
    }
  }
}
