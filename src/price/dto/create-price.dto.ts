import { IsString, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePriceDto {
  @ApiProperty({
    description: 'custom id',
    example: '',
    required: false
  })
  @IsString()
  custom_id?: string

  @ApiProperty({ description: 'Значення ціни', example: 199.99 })
  @IsNumber()
  value: number
}
