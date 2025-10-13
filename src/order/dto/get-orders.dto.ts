import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { OrderStatus } from 'src/common/enums/order.enum'

export class GetOrdersDto extends TakeAndSkipDto {
  @ApiPropertyOptional({ enum: OrderStatus, example: OrderStatus.NEW })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus
}
