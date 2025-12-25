import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsInt } from 'class-validator'
import { Type } from 'class-transformer'

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
