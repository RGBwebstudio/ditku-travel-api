import { Optional } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'

export class CreateTermsOfUseDto {
  @ApiProperty({ example: '{}' })
  @IsString()
  structure: string

  @ApiProperty({ example: LANG.UA })
  @IsEnum(LANG)
  lang: LANG
}
