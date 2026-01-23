import { ApiPropertyOptional } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString, IsArray, ValidateNested, Min, IsEnum } from 'class-validator'

import { ProgramImageDto } from './program-image.dto'
import { ProgramTranslateDto } from './program-translate.dto'
import { ProductProgramType } from '../entities/product-program.entity'

export class UpdateProgramDto {
  @ApiPropertyOptional({ description: 'Program ID (required for updates)' })
  @IsOptional()
  @IsNumber()
  id?: number

  @ApiPropertyOptional({ description: 'Day number (1, 2, 3...)', example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  day?: number

  @ApiPropertyOptional({ description: 'Day title', example: 'БУКОВЕЛЬ' })
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({
    description: 'HTML description with headings and paragraphs',
    example: '<h4>ПРОГУЛЯНКА</h4><p>Опис дня...</p>',
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({
    description: 'Block type: day or banners',
    enum: ProductProgramType,
  })
  @IsOptional()
  @IsEnum(ProductProgramType)
  type?: ProductProgramType

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

  @ApiPropertyOptional({ description: 'Display order', example: 1 })
  @IsOptional()
  @IsNumber()
  order?: number

  @ApiPropertyOptional({
    description: 'Array of images for this day',
    type: [ProgramImageDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProgramImageDto)
  images?: ProgramImageDto[]

  @ApiPropertyOptional({
    description: 'Array of translations',
    type: [ProgramTranslateDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProgramTranslateDto)
  translates?: ProgramTranslateDto[]
}
