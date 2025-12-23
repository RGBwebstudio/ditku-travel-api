import { ApiProperty } from '@nestjs/swagger'

import { IsArray, IsNumber } from 'class-validator'

export class ProductRecommendedDto {
  @ApiProperty({ type: [Number], description: 'Масив id продуктів' })
  @IsArray()
  @IsNumber({}, { each: true })
  productIds: number[]
}
