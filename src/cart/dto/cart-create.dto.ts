import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsInt, IsString, IsJSON, IsEnum } from 'class-validator'
import { DeliveryType } from 'src/common/enums/cart.enum'
import { User } from 'src/user/entities/user.entity'

export class CreateCartDto {
  @ApiProperty({ example: null })
  @IsInt()
  @IsOptional()
  user_id: User | undefined

  @ApiProperty({ example: null })
  @IsString()
  @IsOptional()
  coords: string

  @ApiProperty({ example: DeliveryType.ADDRESS, enum: DeliveryType })
  @IsEnum(DeliveryType)
  delivery_type: DeliveryType

  @ApiProperty({
    example: '{"city":"Одеса", "street": "Центральна вулиця", "house": "125"}'
  })
  @IsJSON()
  meta_data: string
}
