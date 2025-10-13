import { CreateCartDto } from './cart-create.dto'
import { PartialType } from '@nestjs/swagger'

export class UpdateCartDto extends PartialType(CreateCartDto) {}
