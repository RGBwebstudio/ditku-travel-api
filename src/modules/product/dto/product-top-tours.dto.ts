import { ApiProperty } from '@nestjs/swagger'

import { IsArray, IsNumber } from 'class-validator'

export class ProductTopToursDto {
  @ApiProperty({ type: [Number], description: 'Масив id топ турів' })
  @IsArray()
  @IsNumber({}, { each: true })
  productIds: number[]
}
