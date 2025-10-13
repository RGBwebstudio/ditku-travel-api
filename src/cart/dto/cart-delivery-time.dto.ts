import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export class CartDeliveryTimeDto {
  @ApiProperty({
    description: 'ID дати доставки',
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  date?: number | null

  @ApiProperty({
    description: 'ID часового слоту доставки',
    example: 2,
    required: false
  })
  @IsOptional()
  @IsNumber()
  timeSlot?: number | null
}
