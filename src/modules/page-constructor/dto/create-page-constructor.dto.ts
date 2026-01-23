import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsEnum, IsString, IsOptional, IsNumber } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'

import { PageType } from '../entities/page-constructor.entity'

export class CreatePageConstructorDto {
  @ApiProperty({ example: '{}' })
  @IsString()
  structure: string

  @ApiProperty({ example: LANG.UA })
  @IsEnum(LANG)
  lang: LANG

  @ApiPropertyOptional({ example: PageType.FOR_PARENT })
  @IsEnum(PageType)
  @IsOptional()
  page_type?: PageType

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  order?: number

  @ApiPropertyOptional({ example: 'Page title' })
  @ApiProperty({ example: 'Page title' })
  @IsString()
  title: string

  @ApiPropertyOptional({ example: 'SEO title' })
  @IsOptional()
  @IsString()
  seo_title?: string

  @ApiPropertyOptional({ example: 'SEO description' })
  @IsOptional()
  @IsString()
  seo_description?: string

  @ApiPropertyOptional({ example: '/some-url' })
  @ApiProperty({ example: '/some-url' })
  @IsString()
  url: string

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  category_id?: number
}
