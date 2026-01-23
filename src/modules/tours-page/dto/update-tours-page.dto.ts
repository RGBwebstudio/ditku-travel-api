import { ApiProperty } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsEnum, IsOptional, ValidateNested, IsArray, IsNumber } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'

import { ToursPageStructureDto } from './tours-page-structure.dto'

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
  id?: number
}
