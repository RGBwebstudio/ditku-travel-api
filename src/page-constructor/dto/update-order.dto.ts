import { ApiProperty } from '@nestjs/swagger'
import { IsArray, ValidateNested, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

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
