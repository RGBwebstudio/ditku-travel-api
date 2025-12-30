import { ApiPropertyOptional } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateImageCategoryDto {
  @ApiPropertyOptional({
    description: 'Category name',
    example: 'Updated Category Name',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string

  @ApiPropertyOptional({
    description: 'Parent category ID (for tree structure)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number | null
}
