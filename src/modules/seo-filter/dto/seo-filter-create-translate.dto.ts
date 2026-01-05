import { ApiProperty } from '@nestjs/swagger'

import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'

import { SeoFilter } from '../entities/seo-filter.entity'

export class SeoFilterCreateTranslateDto {
  @ApiProperty({ example: 'title' })
  @IsString()
  @IsNotEmpty()
  field: string

  @ApiProperty({ example: 'Значення' })
  @IsString()
  @IsNotEmpty()
  value: string

  @ApiProperty({ example: LANG.UA })
  @IsEnum(LANG)
  lang: LANG

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  entity_id: SeoFilter
}
