import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsString, IsOptional, IsBoolean } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'

export class PostCreateTranslateDto {
  @ApiProperty({ example: 'title' })
  @IsString()
  field: string

  @ApiProperty({ example: 'Заголовок посту' })
  @IsString()
  value: string

  @ApiProperty({ example: LANG.UA, enum: LANG })
  lang: LANG

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  is_top_main?: boolean
}
