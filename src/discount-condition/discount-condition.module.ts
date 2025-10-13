import { Module } from '@nestjs/common'
import { DiscountConditionService } from './discount-condition.service'
import { DiscountConditionController } from './discount-condition.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DiscountCondition } from './entities/discount-condition.entity'
import { Discount } from 'src/discount/entities/discount.entity'

@Module({
  imports: [TypeOrmModule.forFeature([DiscountCondition, Discount])],
  controllers: [DiscountConditionController],
  providers: [DiscountConditionService],
  exports: [DiscountConditionService]
})
export class DiscountConditionModule {}
