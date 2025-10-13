import { PartialType } from '@nestjs/swagger'
import { CartDetailsDto } from './cart-details.dto'

export class CartDetailsUpdateDto extends PartialType(CartDetailsDto) {}
