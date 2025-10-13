import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from '../order/entities/order.entity'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'
import { CartModule } from 'src/cart/cart.module'
import { User } from 'src/user/entities/user.entity'
import { OrderDetails } from './entities/order-details.entity'
import { OrderItem } from './entities/order-item.entity'
import { Product } from 'src/product/entities/product.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetails, OrderItem, User, Product]),
    CartModule
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService]
})
export class OrderModule {}
