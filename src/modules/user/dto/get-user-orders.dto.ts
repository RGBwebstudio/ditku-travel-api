import { ApiProperty } from '@nestjs/swagger'

import { IsInt, Min, IsOptional, IsString, Matches } from 'class-validator'
import { OrderStatus } from 'src/common/enums/order.enum'

export class GetUserOrdersDto {
  @ApiProperty({ type: Number, example: 15 })
  @IsInt()
  @Min(0)
  take: number

  @ApiProperty({ type: Number, example: 0 })
  @IsInt()
  @Min(0)
  skip: number

  @ApiProperty({
    required: false,
    example: OrderStatus.NEW,
    description: 'Filter orders by status (single or multiple via repeated `status` query params)',
  })
  @IsOptional()
  status?: any

  @ApiProperty({
    type: String,
    required: false,
    example: '01.07.25',
    description: 'Filter orders from this date (DD.MM.YY format)',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}\.\d{2}\.\d{2}$/, {
    message: 'dateFrom must be in DD.MM.YY format (e.g., 01.07.25)',
  })
  dateFrom?: string

  @ApiProperty({
    type: String,
    required: false,
    example: '31.12.25',
    description: 'Filter orders to this date (DD.MM.YY format)',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}\.\d{2}\.\d{2}$/, {
    message: 'dateTo must be in DD.MM.YY format (e.g., 31.12.25)',
  })
  dateTo?: string
}
