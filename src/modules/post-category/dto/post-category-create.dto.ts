import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsOptional, IsString } from 'class-validator'

export class PostCategoryCreateDto {
  @ApiProperty({ example: 'Новини' })
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
