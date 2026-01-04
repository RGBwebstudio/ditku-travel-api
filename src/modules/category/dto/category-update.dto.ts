import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsOptional, IsString } from 'class-validator'

import { CategoryCreateDto } from './category-create.dto'

export class CategoryUpdateDto extends PartialType(CategoryCreateDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_text_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_text_en?: string
}
