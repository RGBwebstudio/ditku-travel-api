import { ApiProperty } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsEnum, IsOptional, ValidateNested, IsArray, IsNumber } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'

import { ToursPageStructureDto } from './tours-page-structure.dto'
import { ToursPageCategoryItemType } from '../enums/tours-page-category-item-type.enum'

export class ToursPageCategoryItemDto {
  @IsOptional()
  @IsNumber()
  category_id?: number

  @IsOptional()
  @IsNumber()
  seo_filter_id?: number

  @IsNumber()
  order: number

  @IsOptional()
  @IsEnum(ToursPageCategoryItemType)
  type?: ToursPageCategoryItemType
}

export class UpdateToursPageDto {
  @ApiProperty({ example: LANG.UA })
  @IsEnum(LANG)
  lang: LANG

  @ApiProperty({ type: ToursPageStructureDto })
  @ValidateNested()
  @Type(() => ToursPageStructureDto)
  structure: ToursPageStructureDto

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  popular_tours_ids?: number[]

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  recommended_post_ids?: number[]

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  navigator_subcategory_ids?: number[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ToursPageCategoryItemDto)
  category_items?: ToursPageCategoryItemDto[]

  @IsOptional()
  id?: number
}
