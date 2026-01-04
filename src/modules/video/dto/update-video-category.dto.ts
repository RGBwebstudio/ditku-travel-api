import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsOptional, IsString } from 'class-validator'

export class UpdateVideoCategoryDto {
  @ApiPropertyOptional({ example: 'Нові відео' })
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string
}
