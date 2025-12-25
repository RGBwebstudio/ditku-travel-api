import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateImageCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Product Images',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string

  @ApiPropertyOptional({
    description: 'Parent category ID (for tree structure)',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number
}
