import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'
import { Measurement } from '../entities/measurement.entity'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class MeasurementCreateTranslateDto {
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
  entity_id: Measurement
}
