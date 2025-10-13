import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PaymentType } from 'src/common/enums/order.enum'

export class CreateOrderDto {
  @ApiPropertyOptional({ example: '123' })
  @IsString()
  @IsOptional()
  custom_id: string

  @ApiProperty({ example: PaymentType.ONLINE })
  @IsEnum(PaymentType)
  payment_type: PaymentType

  @ApiProperty({ example: '{}' })
  @IsString()
  meta_data: string
}
