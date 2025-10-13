import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateOrderDetailsDto } from './create-order-details.dto'
import { OrderStatus } from 'src/common/enums/order.enum'
import { IsBoolean, IsEnum } from 'class-validator'

export class UpdateOrderDetailsDto extends PartialType(CreateOrderDetailsDto) {
  @ApiProperty({ enum: OrderStatus, default: OrderStatus.NEW })
  @IsEnum(OrderStatus)
  status: OrderStatus.NEW

  @ApiProperty({ example: false })
  @IsBoolean()
  is_paid: boolean
}
