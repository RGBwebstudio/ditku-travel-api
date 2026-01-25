import { ApiProperty } from '@nestjs/swagger'

import { IsEnum, IsString } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'

export class CreateContentDto {
  @ApiProperty({ example: '{}' })
  @IsString()
  value: string

  @ApiProperty({ example: LANG.UA })
  @IsEnum(LANG)
  lang: LANG
}
