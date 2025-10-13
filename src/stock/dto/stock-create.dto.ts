import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString, Validate } from 'class-validator'
import { IsExist } from 'src/common/validators/isExist.validator'
import { Product } from 'src/product/entities/product.entity'

export class StockCreateDto {
  @ApiPropertyOptional({ example: '123' })
  @IsString()
  @IsOptional()
  custom_id: string

  @ApiProperty({ example: '1.250' })
  @IsString()
  amount: string

  @ApiProperty({ example: 1 })
  @IsInt()
  @Validate(IsExist, ['product', 'id'])
  product: Product
}
