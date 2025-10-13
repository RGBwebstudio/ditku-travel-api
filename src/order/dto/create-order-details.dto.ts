import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator'
import { PaymentType } from 'src/common/enums/order.enum'

export class CreateOrderDetailsDto {
  @ApiPropertyOptional({ example: '123' })
  @IsString()
  @IsOptional()
  custom_id: string

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  order_id?: number

  @ApiProperty({ example: PaymentType.ONLINE })
  @IsEnum(PaymentType)
  payment_type: PaymentType

  @ApiProperty({ example: '{}' })
  meta_data: string
}
