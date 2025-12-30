import { ApiProperty } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsArray, ValidateNested, IsNumber } from 'class-validator'

class OrderItemDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number

  @ApiProperty({ example: 0 })
  @IsNumber()
  order: number
}

export class UpdateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[]
}
