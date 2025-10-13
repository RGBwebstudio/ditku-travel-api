import { ApiProperty, PartialType } from '@nestjs/swagger'
import { ProductPromotiontCreateTranslateDto } from './product-promotion-create-translate.dto'
import { IsInt } from 'class-validator'

export class ProductPromotionUpdateTranslateDto extends PartialType(
  ProductPromotiontCreateTranslateDto
) {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number
}
