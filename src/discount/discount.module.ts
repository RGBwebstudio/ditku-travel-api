import { Module } from '@nestjs/common'
import { DiscountService } from './discount.service'
import { DiscountController } from './discount.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Discount } from './entities/discount.entity'
import { DiscountCondition } from 'src/discount-condition/entities/discount-condition.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Discount, DiscountCondition])],
  controllers: [DiscountController],
  providers: [DiscountService],
  exports: [DiscountService]
})
export class DiscountModule {}
