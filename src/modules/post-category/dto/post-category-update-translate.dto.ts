import { ApiProperty } from '@nestjs/swagger'

import { IsEnum, IsInt, IsString } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'

export class PostCategoryUpdateTranslateDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number

  @ApiProperty({ example: 'title' })
  @IsString()
  field: string

  @ApiProperty({ example: 'Новини' })
  @IsString()
  value: string

  @ApiProperty({ example: LANG.UA })
  @IsEnum(LANG)
  lang: LANG
}
