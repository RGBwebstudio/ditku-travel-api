import { PartialType } from '@nestjs/mapped-types'
import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsOptional, IsString, IsArray, IsNumber } from 'class-validator'

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

  @ApiPropertyOptional()
  @IsOptional()
  structure?: any

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  navigator_subcategory_ids?: number[]
}
