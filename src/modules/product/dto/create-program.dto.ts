import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsOptional, IsString, IsArray, ValidateNested, IsEnum, IsNumber } from 'class-validator'

import { ProgramImageDto } from './program-image.dto'
import { ProgramTranslateDto } from './program-translate.dto'
import { ProductProgramType } from '../entities/product-program.entity'

export class CreateProgramDto {
  @ApiProperty({ description: 'Day badge', example: 'День 1' })
  @IsString()
  @IsOptional()
  badge: string

  @ApiProperty({ description: 'Day title', example: 'БУКОВЕЛЬ' })
  @IsString()
  title: string

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
