import { PartialType } from '@nestjs/swagger'
import { ProductPromotionCreateDto } from './product-promotion-create.dto'

export class ProductPromotionUpdateDto extends PartialType(
  ProductPromotionCreateDto
) {}
