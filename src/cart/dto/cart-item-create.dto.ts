import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Validate
} from 'class-validator'
import { IsExist } from 'src/common/validators/isExist.validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CartItemCreateDto {
  @ApiPropertyOptional({ example: 1 })
  @IsString()
  @IsOptional()
  custom_id: string

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  @Validate(IsExist, ['product', 'id'])
  product_id: number

  @ApiProperty({ example: null })
  @IsInt()
  @IsOptional()
  parent_bundle_id: number

  @ApiProperty({ example: null })
  @IsInt()
  @IsPositive()
  @IsOptional()
  bundle_id: number

  @ApiProperty({ example: '1.000' })
  @IsString()
  amount: string

  @ApiProperty({ example: 'примітка' })
  @IsString()
  comment: string
}
