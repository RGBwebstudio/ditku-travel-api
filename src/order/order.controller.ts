import { UpdateOrderDetailsDto } from './dto/update-order-details.dto'
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  Delete
} from '@nestjs/common'
import { OrderService } from './order.service'
import { Request } from 'express'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { GetOrdersDto } from './dto/get-orders.dto'
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger'
import { OrderStatusDto } from './dto/order-status.dto'
import { CreateOrderDto } from './dto/create-order.dto'
import { CreateOrderItemDto } from './dto/create-order-item.dto'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'
import { AuthGuard } from 'src/auth/auth.guard'

@ApiTags('Замовлення')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно отримано'
  })
  @ApiOperation({ summary: 'Отримати частину замовлень' })
  getOrders(@Query() { take, skip, status }: GetOrdersDto) {
    // take and skip come from TakeAndSkipDto (numbers), status is optional OrderStatus
    return this.orderService.getOrders(take, skip, status)
  }

  @Get('search')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Пошук замовлень по id, телефону або імені' })
  async searchOrders(@Query('q') q: string) {
    return await this.orderService.searchOrders(q)
  }

  @Get(':id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно отримано'
  })
  @ApiOperation({ summary: 'Вибрати замовлення за id' })
  getOrder(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrder(id)
  }

  @Post('create')
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутність успішно отримано'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Сутність не cтворено'
  })
  @ApiResponse({
    status: 400,
    description: 'СART_IS_NOT_CREATED - Корзина ще не створена'
  })
  @ApiResponse({
    status: 400,
    description: 'CART_IS_EMPTY - Корзина не має товарів'
  })
  @ApiOperation({ summary: 'Запит на створення замовлення' })
  createOrder(@Body() dto: CreateOrderDto, @Req() req: Request) {
    return this.orderService.createOrder(dto, req.sessionID, req.lang)
  }

  @Patch('status/:id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно отримано'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_UPDATED - Сутність не оновлено'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_FOUND - Сутність не знайдено'
  })
  @ApiOperation({ summary: 'Зміна статусу замовлення' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: OrderStatusDto
  ) {
    return this.orderService.updateStatus(id, dto.status)
  }

  @Get('list/user/:id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Список сутностей успішно отримано'
  })
  @ApiOperation({ summary: 'Отримати cписок всіх замовлень юзера' })
  getUserOrders(
    @Param('id', ParseIntPipe) id: number,
    @Query() { take, skip }: TakeAndSkipDto
  ) {
    return this.orderService.getUserOrders(id, take, skip)
  }

  @Get('user-product-purchase/:productId')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно перевірено покупку товару користувачем'
  })
  @ApiResponse({
    status: 401,
    description: 'NOT_AUTHORIZED - Користувач не авторизований'
  })
  @ApiOperation({ summary: 'Перевірити чи користувач купував товар' })
  checkUserProductPurchase(
    @Param('productId', ParseIntPipe) productId: number,
    @Req() req: Request
  ) {
    return this.orderService.checkUserProductPurchase(productId, req)
  }

  @Patch('details/:id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Деталі замовлення оновлено'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_UPDATED - Деталі не оновлено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Деталі не знайдено'
  })
  @ApiOperation({ summary: 'Оновити деталі замовлення' })
  @ApiBody({
    description: 'Тіло запиту',
    type: UpdateOrderDetailsDto,
    required: true
  })
  async updateOrderDetails(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDetailsDto
  ) {
    return await this.orderService.updateOrderDetails(id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Замовлення видалено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Замовлення не знайдено'
  })
  @ApiOperation({ summary: 'Видалити замовлення за id' })
  async deleteOrder(@Param('id', ParseIntPipe) id: number) {
    return await this.orderService.deleteOrder(id)
  }

  @Post('direct-create')
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Замовлення створено напряму'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Замовлення не створено'
  })
  @ApiOperation({ summary: 'Створити замовлення напряму (без корзини)' })
  async directCreateOrder(@Body() dto: CreateOrderDto) {
    return await this.orderService.directCreateOrder(dto)
  }

  @Post('add-item')
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Товар додано до замовлення'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Товар не додано'
  })
  @ApiOperation({ summary: 'Додати товар до замовлення' })
  async addOrderItem(@Body() dto: CreateOrderItemDto) {
    return await this.orderService.addOrderItem(dto)
  }

  @Post('remove-item')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Товар видалено із замовлення'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_DELETED - Товар не видалено'
  })
  @ApiOperation({ summary: 'Видалити товар із замовлення' })
  async removeOrderItem(@Body() dto: { order_item_id: number }) {
    return await this.orderService.removeOrderItem(dto.order_item_id)
  }
}
