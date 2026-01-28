import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator'

import { Category } from '../entities/category.entity'

export class CategoryCreateImageDto {
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

  @IsInt()
  @IsPositive()
  entity_id: Category | number
}
