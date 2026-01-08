import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsInt, IsOptional, IsString, Validate, IsNumber } from 'class-validator'
import { IsExist } from 'src/common/validators/isExist.validator'
import { Product } from 'src/modules/product/entities/product.entity'

export class RatingCreateDto {
  @ApiProperty({ example: "Ім'я користувача" })
  @IsString()
  name: string

  @ApiPropertyOptional({ example: 'Чудовий тур, сподобався!' })
  @IsString()
  @IsOptional()
  review: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text_en?: string

  @ApiProperty({ example: 5 })
  @IsNumber()
  rating: number

  @ApiProperty({ example: 1 })
  @IsInt()
  @Validate(IsExist, ['product', 'id'])
  product_id: Product

  @ApiPropertyOptional({ example: '2025-01-15T12:00:00.000Z' })
  @IsOptional()
  created_at?: Date
}
