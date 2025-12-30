import { ApiPropertyOptional } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class ImageQueryDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20

  @ApiPropertyOptional({
    description: 'Filter by category ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number

  @ApiPropertyOptional({
    description: 'Filter by original name (partial match, case-insensitive)',
    example: 'product',
  })
  @IsOptional()
  @IsString()
  originalName?: string
}
