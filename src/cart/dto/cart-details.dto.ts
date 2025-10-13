import { ApiProperty } from '@nestjs/swagger'
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber
} from 'class-validator'
import { DeliveryType } from 'src/common/enums/cart.enum'

export class CartDetailsDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsNumber()
  cart_id: number

  @ApiProperty({ example: '[0, 0]' })
  @IsOptional()
  @IsString()
  coords: string

  @ApiProperty({ example: DeliveryType.ADDRESS })
  @IsEnum(DeliveryType)
  delivery_type: DeliveryType

  @ApiProperty({
    example: '{"city":"Одеса", "street": "Центральна вулиця", "house": "125"}'
  })
  @IsString()
  meta_data: string
}
