import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CategoryCreateTranslateDto } from './category-create-translate.dto'
import { IsInt } from 'class-validator'

export class CategoryUpdateTranslateDto extends PartialType(
  CategoryCreateTranslateDto
) {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number
}
