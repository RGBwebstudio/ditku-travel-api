import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class ImageCategoryQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by parent category ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number
}
