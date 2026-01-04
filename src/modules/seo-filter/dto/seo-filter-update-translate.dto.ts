import { ApiProperty, PartialType } from '@nestjs/swagger'

import { IsInt, IsNotEmpty, IsPositive } from 'class-validator'

import { SeoFilterCreateTranslateDto } from './seo-filter-create-translate.dto'

export class SeoFilterUpdateTranslateDto extends PartialType(SeoFilterCreateTranslateDto) {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number
}
