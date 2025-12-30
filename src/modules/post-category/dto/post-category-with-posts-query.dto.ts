import { ApiPropertyOptional } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsOptional, IsInt, Min, IsString, IsBoolean } from 'class-validator'

export class PostCategoryWithPostsQueryDto {
  @ApiPropertyOptional({
    description: 'Maximum number of posts to return per category',
    example: 10,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number

  @ApiPropertyOptional({
    description: 'Sort posts within each category (e.g., "created_at:desc", "created_at:asc")',
    example: 'created_at:desc',
    type: String,
  })
  @IsOptional()
  @IsString()
  sort?: string

  @ApiPropertyOptional({
    description: 'Include categories with no posts',
    example: true,
    type: Boolean,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeEmpty?: boolean
}
