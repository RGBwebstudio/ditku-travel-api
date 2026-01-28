import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator'

import { Product } from '../entities/product.entity'

export class ProductCreateImageDto {
  @IsString()
  name: string

  @IsString()
  path: string

  @IsString()
  @IsOptional()
  path_md?: string

  @IsString()
  @IsOptional()
  path_sm?: string

  @IsOptional()
  @IsInt()
  order?: number

  @IsInt()
  @IsPositive()
  entity_id: Product | number
}
