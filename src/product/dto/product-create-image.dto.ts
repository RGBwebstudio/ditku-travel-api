import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator'
import { Product } from '../entities/product.entity'

export class ProductCreateImageDto {
  @IsString()
  @IsOptional()
  custom_id: string

  @IsString()
  name: string

  @IsString()
  path: string

  @IsOptional()
  @IsInt()
  order?: number

  @IsInt()
  @IsPositive()
  entity_id: Product | number
}
