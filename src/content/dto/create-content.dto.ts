import { Optional } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'

export class CreateContentDto {
  @ApiPropertyOptional({ example: 'custom-key-1' })
  @IsString()
  @Optional()
  custom_id: string

  @ApiProperty({ example: '{}' })
  @IsString()
  value: string

  @ApiProperty({ example: LANG.UA })
  @IsEnum(LANG)
  lang: LANG
}
