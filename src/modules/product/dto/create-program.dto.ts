import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString, IsArray, ValidateNested, Min } from 'class-validator'

import { ProgramImageDto } from './program-image.dto'
import { ProgramTranslateDto } from './program-translate.dto'

export class CreateProgramDto {
  @ApiProperty({ description: 'Day number (1, 2, 3...)', example: 1 })
  @IsNumber()
  @Min(1)
  day: number

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
