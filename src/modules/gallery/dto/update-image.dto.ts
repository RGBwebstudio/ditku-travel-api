import { ApiPropertyOptional } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsOptional, IsInt } from 'class-validator'

export class UpdateImageDto {
  @ApiPropertyOptional({
    description: 'Category ID to assign the image to',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number | null
}
