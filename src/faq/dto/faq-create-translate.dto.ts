import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Faq } from '../entities/faq.entity'

export class FaqCreateTranslateDto {
  @ApiPropertyOptional({ example: '123' })
  @IsString()
  @IsOptional()
  custom_id: string

  @ApiProperty({ example: 'title' })
  @IsString()
  field: string

  @ApiProperty({ example: 'переклад' })
  @IsString()
  value: string

  @ApiProperty({ example: LANG.EN })
  @IsEnum(LANG)
  lang: LANG

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  entity_id: Faq
}
