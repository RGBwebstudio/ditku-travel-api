import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsOptional, IsString, IsInt } from 'class-validator'

export class UpdateVideoDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  category_id?: number | null

  @ApiPropertyOptional({ example: 'https://www.youtube.com/watch?v=abc123' })
  @IsOptional()
  @IsString()
  youtube_link?: string

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  order?: number
}
