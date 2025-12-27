import { ApiPropertyOptional } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsInt, IsOptional } from 'class-validator'

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
