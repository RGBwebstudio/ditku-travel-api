import { IsString, IsOptional, IsArray, IsInt } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class SeoFilterCreateDto {
  @ApiProperty({ example: 'З Харкова' })
  @IsOptional()
  @IsString()
  title?: string

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

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  category_id?: number

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
}
