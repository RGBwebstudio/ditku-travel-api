import { ApiProperty } from '@nestjs/swagger'

import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'

export class CreateSafeWithUsDto {
  @ApiProperty({ example: { title: 'Safe With Us', slides: [] } })
  @IsNotEmpty()
  structure: any

  @ApiProperty({ enum: LANG, default: LANG.UA })
  @IsEnum(LANG)
  @IsOptional()
  lang: LANG
}
