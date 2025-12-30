import { ApiProperty, PartialType } from '@nestjs/swagger'

import { IsInt } from 'class-validator'

import { ProductCreateTranslateDto } from './product-create-translate.dto'

export class ProductUpdateTranslateDto extends PartialType(ProductCreateTranslateDto) {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number
}
