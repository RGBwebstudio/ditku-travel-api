import {
  Controller,
  Body,
  Post,
  Patch,
  Delete,
  Req,
  Logger,
  Param,
  ParseIntPipe,
  Get,
  Put
} from '@nestjs/common'
import { CartService } from './cart.service'
import { CreateCartDto } from './dto/cart-create.dto'
import { CartItemCreateDto } from './dto/cart-item-create.dto'
import { UpdateCartDto } from './dto/cart-update.dto'
import { CartItemAmountDto } from './dto/cart-item-amount.dto'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { CartItemCommentDto } from './dto/cart-item-comment'
import { CartDetailsUpdateDto } from './dto/cart-details-update.dto'
import { CartDeliveryTimeDto } from './dto/cart-delivery-time.dto'
import { CartUpdateUserDto } from './dto/cart-update-user.dto'

@ApiTags('Корзина')
@Controller('cart')
export class CartController {
  private readonly logger = new Logger(CartController.name)

  constructor(private cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати корзину' })
  async getCart(@Req() req: Request) {
    return this.cartService.getCartWithMinimalPrice(req.sessionID, req.lang)
  }

  @Post('create')
  @ApiOperation({ summary: 'Створити корзину' })
  async create(@Body() dto: CreateCartDto, @Req() req: Request) {
    const cart = await this.cartService.createCart(dto, req.sessionID)
    req.session.cart_id = cart.id
    req.session.save()
    return cart
  }

  @Patch()
  @ApiOperation({ summary: 'Оновити корзину' })
  update(@Body() dto: UpdateCartDto, @Req() req: Request) {
    return this.cartService.updateCart(dto, req.sessionID, req.lang)
  }

  @Put('details/:id')
  @ApiOperation({ summary: 'Оновити деталі кошика' })
  getCartDetails(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CartDetailsUpdateDto
  ) {
    return this.cartService.updateCartDetails(id, dto)
  }

  @Post('add-item')
  @ApiOperation({ summary: 'Додати набір товарів до корзини' })
  @ApiBody({
    type: CartItemCreateDto,
    description: 'Обʼєкт з масивом товарів',
    required: true,
    isArray: true
  })
  addItem(@Body() dto: CartItemCreateDto[], @Req() req: Request) {
    return this.cartService.addItem(dto, req.sessionID)
  }

  @Patch('cart-item/amount')
  @ApiOperation({ summary: 'Оновити к-ть товару в корзині' })
  updateAmount(@Body() dto: CartItemAmountDto, @Req() req: Request) {
    return this.cartService.updateCartItemAmount(dto, req.sessionID)
  }

  @Patch('cart-item/comment')
  @ApiOperation({ summary: 'Оновити примітку товару в корзині' })
  updateComment(@Body() dto: CartItemCommentDto, @Req() req: Request) {
    return this.cartService.updateCartItemComment(dto, req.sessionID, req.lang)
  }

  @Delete('delete-item/:id')
  @ApiOperation({ summary: 'Видалити товар з корзини' })
  deleteItem(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.cartService.deleteItem(id, req.sessionID, req.lang)
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Видалити корзину' })
  deleteCart(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.delete(id)
  }

  @Patch('delivery-time')
  @ApiOperation({ summary: 'Оновити час доставки корзини' })
  updateDeliveryTime(@Body() dto: CartDeliveryTimeDto, @Req() req: Request) {
    return this.cartService.updateDeliveryTime(dto, req.sessionID, req.lang)
  }

  @Delete('clear/items')
  @ApiOperation({ summary: 'Очистити корзину (видалити всі товари)' })
  clearCart(@Req() req: Request) {
    return this.cartService.clearCart(req.sessionID, req.lang)
  }

  @Get('recommended-products')
  @ApiOperation({
    summary: 'Отримати рекомендовані товари для товарів у корзині'
  })
  getRecommendedProducts(@Req() req: Request) {
    return this.cartService.getRecommendedProducts(req.sessionID, req.lang)
  }

  @Get('unavailable-items')
  @ApiOperation({
    summary: 'Отримати недоступні товари та їх заміни'
  })
  getUnavailableItems(@Req() req: Request) {
    return this.cartService.getUnavailableItems(req.sessionID, req.lang)
  }

  @Post('replace-item')
  @ApiOperation({
    summary: 'Замінити недоступний товар на товар заміни'
  })
  replaceUnavailableItem(
    @Body() body: { unavailableItemId: number; replacementProductId: number },
    @Req() req: Request
  ) {
    return this.cartService.replaceUnavailableItem(
      req.sessionID,
      body.unavailableItemId,
      body.replacementProductId,
      req.lang
    )
  }

  @Patch('update-user')
  @ApiOperation({ summary: 'Оновити користувача корзини' })
  updateUserOfCart(@Body() dto: CartUpdateUserDto) {
    return this.cartService.updateUserOfCart(dto)
  }
}
