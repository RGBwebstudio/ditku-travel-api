import { ApiProperty, PartialType } from '@nestjs/swagger'

import { IsInt } from 'class-validator'

import { ParameterCategoryCreateTranslateDto } from './parameter-category-create-translate.dto'

export class ParameterCategoryUpdateTranslateDto extends PartialType(ParameterCategoryCreateTranslateDto) {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number
}
