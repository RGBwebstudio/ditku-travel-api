import { ApiProperty, PartialType } from '@nestjs/swagger'

import { IsInt } from 'class-validator'

import { CategoryCreateTranslateDto } from './category-create-translate.dto'

export class CategoryUpdateTranslateDto extends PartialType(CategoryCreateTranslateDto) {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number
}
