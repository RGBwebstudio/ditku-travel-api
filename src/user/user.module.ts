import { forwardRef, Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { MailSenderModule } from 'src/mail-sender/mail-sernder.module'
import { OrderModule } from 'src/order/order.module'
import { CartModule } from 'src/cart/cart.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => MailSenderModule),
    forwardRef(() => OrderModule),
    forwardRef(() => CartModule)
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
