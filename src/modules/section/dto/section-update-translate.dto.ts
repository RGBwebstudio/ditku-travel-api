import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsEnum, IsInt, IsOptional, IsPositive, IsString } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'

import { SectionTranslate } from '../entities/section-translate.entity'

export class SectionUpdateTranslateDto {
  @ApiPropertyOptional({ example: 'title' })
  @IsOptional()
  @IsString()
  field?: string

  @ApiPropertyOptional({ example: 'переклад' })
  @IsOptional()
  @IsString()
  value?: string

  @ApiPropertyOptional({ example: LANG.EN })
  @IsOptional()
  @IsEnum(LANG)
  lang?: LANG

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  entity_id?: SectionTranslate

  id: number
}
