import { ApiProperty } from '@nestjs/swagger'

import { IsEnum, IsString } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'

export class CreateCookieDto {
  @ApiProperty({ example: '{}' })
  @IsString()
  structure: string

  @ApiProperty({ example: LANG.UA })
  @IsEnum(LANG)
  lang: LANG
}
