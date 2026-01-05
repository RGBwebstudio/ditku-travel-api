import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsOptional, IsString } from 'class-validator'

export class CreateVideoCategoryDto {
  @ApiProperty({ example: 'Тури Україною' })
  @IsString()
  title: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string
}
