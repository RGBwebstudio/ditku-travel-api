import { IsEnum, IsInt, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { LANG } from 'src/common/enums/translation.enum'

export class PostCategoryCreateTranslateDto {
  @ApiProperty({ example: 'title' })
  @IsString()
  field: string

  @ApiProperty({ example: 'Новини' })
  @IsString()
  value: string

  @ApiProperty({ example: LANG.UA })
  @IsEnum(LANG)
  lang: LANG

  @ApiProperty({ example: 1 })
  @IsInt()
  entity_id: number
}
