import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive, IsString, Validate } from 'class-validator'
import { IsExist } from 'src/common/validators/isExist.validator'

export class CartItemAmountDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  @Validate(IsExist, ['cart_item', 'id'])
  id: number

  @ApiProperty({ example: '10.000' })
  @IsString()
  amount: string
}
