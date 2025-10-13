import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator'
import { Category } from '../entities/category.entity'

export class CategoryCreateImageDto {
  @IsString()
  @IsOptional()
  custom_id: string

  @IsString()
  name: string

  @IsString()
  path: string

  @IsInt()
  @IsPositive()
  entity_id: Category | number
}
