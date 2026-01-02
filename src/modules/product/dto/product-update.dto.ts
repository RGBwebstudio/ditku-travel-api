import { ApiPropertyOptional, PartialType } from '@nestjs/swagger'

import { IsOptional } from 'class-validator'

import { ProductCreateDto } from './product-create.dto'

export class ProductUpdateDto extends PartialType(ProductCreateDto) {
  @ApiPropertyOptional({ example: '2023-12-01T00:00:00Z' })
  @IsOptional()
  start_date?: Date

  @ApiPropertyOptional({ example: '2023-12-31T23:59:59Z' })
  @IsOptional()
  end_date?: Date
}
