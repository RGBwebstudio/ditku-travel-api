import { ApiProperty, PartialType } from '@nestjs/swagger'
import { ParameterCategoryCreateTranslateDto } from './parameter-category-create-translate.dto'
import { IsInt } from 'class-validator'

export class ParameterCategoryUpdateTranslateDto extends PartialType(
  ParameterCategoryCreateTranslateDto
) {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number
}
