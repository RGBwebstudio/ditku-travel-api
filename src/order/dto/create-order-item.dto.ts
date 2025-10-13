import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator'

export class CreateOrderItemDto {
  @ApiPropertyOptional({ example: '123' })
  @IsString()
  @IsOptional()
  custom_id: string

  @ApiProperty({ example: '1.000' })
  @IsString()
  amount: string

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  measurement: string

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  product_id: number

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  order_id: number

  @ApiProperty({ example: '100.00' })
  @IsString()
  price: string
}
