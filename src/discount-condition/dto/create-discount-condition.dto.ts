import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { Discount } from 'src/discount/entities/discount.entity'

export class CreateDiscountConditionDto {
  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  // use Discount entity type for relation
  discount_id?: Discount

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  title?: string

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  condition_type?: string

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  condition_criteria?: string

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  condition_value?: string
}
