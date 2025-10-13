import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { RatingService } from './rating.service'
import { RatingController } from './rating.controller'
import { Rating } from './entities/rating.entity'
import { OrderItem } from 'src/order/entities/order-item.entity'
import { IsExist } from 'src/common/validators/isExist.validator'

@Module({
  imports: [
    TypeOrmModule.forFeature([Rating, OrderItem]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' }
    })
  ],
  controllers: [RatingController],
  providers: [RatingService, IsExist],
  exports: [RatingService]
})
export class RatingModule {}
