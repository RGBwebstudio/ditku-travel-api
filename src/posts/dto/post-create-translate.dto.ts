import { IsString, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LANG } from 'src/common/enums/translation.enum'

export class PostCreateTranslateDto {
  @ApiPropertyOptional({ example: '123' })
  @IsString()
  @IsOptional()
  custom_id?: string

  @ApiProperty({ example: 'title' })
  @IsString()
  field: string

  @ApiProperty({ example: 'Заголовок посту' })
  @IsString()
  value: string

  @ApiProperty({ example: LANG.UA, enum: LANG })
  lang: LANG
}
