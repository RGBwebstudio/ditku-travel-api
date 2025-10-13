import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive, Validate } from 'class-validator'
import { IsExist } from 'src/common/validators/isExist.validator'

export class CartItemIdDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  @Validate(IsExist, ['cart_item', 'id'])
  id: number
}
