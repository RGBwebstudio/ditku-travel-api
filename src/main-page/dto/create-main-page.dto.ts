import { Optional } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'

export class CreateMainPageDto {
  @ApiPropertyOptional({ example: '123' })
  @IsString()
  @Optional()
  custom_id: string

  @ApiProperty({ example: '{}' })
  @IsString()
  structure: string

  @ApiProperty({ example: LANG.UA })
  @IsEnum(LANG)
  lang: LANG
}
