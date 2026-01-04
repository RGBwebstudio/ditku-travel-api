import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class CreateCityDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  is_hidden: boolean

  @ApiProperty({ example: 'Одеса' })
  @IsString()
  title: string

  @ApiProperty({ example: 'odesa' })
  @IsString()
  url: string

  @ApiPropertyOptional({ example: 'SEO Title' })
  @IsOptional()
  @IsString()
  seo_title?: string

  @ApiPropertyOptional({ example: 'SEO description' })
  @IsOptional()
  @IsString()
  seo_description?: string

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  order?: number

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  country_id?: number

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
}
