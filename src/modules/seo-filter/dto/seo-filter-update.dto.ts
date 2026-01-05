import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsString, IsOptional, IsArray, IsInt, IsNotEmpty } from 'class-validator'

export class SeoFilterUpdateDto {
  @ApiProperty({ example: 'З Харкова' })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: 'z-harkova' })
  @IsString()
  url: string

  @ApiPropertyOptional({ example: 'SEO title' })
  @IsOptional()
  @IsString()
  seo_title?: string

  @ApiPropertyOptional({ example: 'SEO description' })
  @IsOptional()
  @IsString()
  seo_description?: string

  @ApiPropertyOptional({ example: 'Cео-текст' })
  @IsOptional()
  @IsString()
  seo_text?: string

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  category_id: number

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  city_id?: number

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  country_id?: number

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  parent_id?: number

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  sections?: number[]

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
  seo_title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_title_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_description_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_description_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_text_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_text_en?: string
}
