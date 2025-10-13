import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { CartStatus } from 'src/common/enums/cart.enum'

export class CartStatusDto {
  @ApiProperty({ example: CartStatus.NEW, enum: CartStatus })
  @IsEnum(CartStatus)
  status: CartStatus
}
