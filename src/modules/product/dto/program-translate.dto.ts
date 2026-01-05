import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'

export class ProgramTranslateDto {
  @ApiPropertyOptional({ description: 'Translate ID (for updates)' })
  @IsOptional()
  @IsNumber()
  id?: number

  @ApiProperty({ description: 'Language', enum: LANG })
  @IsEnum(LANG)
  lang: LANG

  @ApiProperty({ description: 'Field name (title or description)' })
  @IsString()
  field: string

  @ApiProperty({ description: 'Translated value' })
  @IsString()
  value: string
}

