import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { OrderStatus } from 'src/common/enums/order.enum'

export class OrderStatusDto {
  @ApiProperty({ example: OrderStatus.NEW, enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus
}
