import { PartialType } from '@nestjs/swagger'
import { CreateDiscountConditionDto } from './create-discount-condition.dto'

export class UpdateDiscountConditionDto extends PartialType(
  CreateDiscountConditionDto
) {}
