import { IsInt, IsPositive, IsString } from 'class-validator'

import { Category } from '../entities/category.entity'

export class CategoryCreateImageDto {
  @IsString()
  name: string

  @IsString()
  path: string

  @IsInt()
  @IsPositive()
  entity_id: Category | number
}
