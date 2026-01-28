import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsOptional, IsString, IsArray, IsInt, Min } from 'class-validator'

export class CreatePostSectionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  id?: number

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
  description_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  images?: (string | { url: string; url_md?: string; url_sm?: string })[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banner1_title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banner1_title_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banner1_button_text_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banner1_button_text_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banner1_link_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banner1_link_en?: string

  // Banner 2
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banner2_title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banner2_title_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banner2_button_text_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banner2_button_text_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banner2_link_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banner2_link_en?: string
}
