import { IsNumber, IsPositive } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateMinimalOrderPriceDto {
  @ApiProperty({
    description: 'Мінімальна сума замовлення',
    example: 199
  })
  @IsNumber()
  @IsPositive()
  price: number
}
