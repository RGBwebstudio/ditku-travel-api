import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsNumber, IsOptional, IsString } from 'class-validator'

export class ProgramImageDto {
  @ApiPropertyOptional({ description: 'Image ID (for updates)' })
  @IsOptional()
  @IsNumber()
  id?: number

  @ApiPropertyOptional({ description: 'Full URL to image' })
  @IsOptional()
  @IsString()
  url?: string

  @ApiPropertyOptional({ description: 'Relative path to image' })
  @IsOptional()
  @IsString()
  path?: string

  @ApiPropertyOptional({ description: 'Relative path to md image' })
  @IsOptional()
  @IsString()
  path_md?: string

  @ApiPropertyOptional({ description: 'Relative path to sm image' })
  @IsOptional()
  @IsString()
  path_sm?: string

  @ApiPropertyOptional({ description: 'Display order' })
  @IsOptional()
  @IsNumber()
  order?: number
}
