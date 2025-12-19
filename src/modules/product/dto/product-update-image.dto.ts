import { PartialType } from '@nestjs/swagger'
import { ProductCreateImageDto } from './product-create-image.dto'

export class ProductUpdateImageDto extends PartialType(ProductCreateImageDto) {}
