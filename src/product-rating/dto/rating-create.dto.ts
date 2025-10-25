import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString, Validate } from 'class-validator'
import { IsExist } from 'src/common/validators/isExist.validator'
import { Product } from 'src/product/entities/product.entity'

export class RatingCreateDto {
  @ApiPropertyOptional({ example: '123' })
  @IsString()
  @IsOptional()
  custom_id: string

  @ApiProperty({ example: '5.0' })
  @IsString()
  rating: string

  @ApiPropertyOptional({ example: 'Чудовий товар, сподобався!' })
  @IsString()
  @IsOptional()
  review: string

  @ApiProperty({ example: 1 })
  @IsInt()
  @Validate(IsExist, ['product', 'id'])
  product_id: Product
}
