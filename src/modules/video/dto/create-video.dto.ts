import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsInt, IsOptional, IsString } from 'class-validator'

export class CreateVideoDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  category_id?: number

  @ApiProperty({ example: 'https://www.youtube.com/watch?v=abc123' })
  @IsString()
  youtube_link: string

  @ApiPropertyOptional({ example: 'https://img.com/url.jpg' })
  @IsOptional()
  @IsString()
  thumbnail?: string

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  order?: number
}
