import { ApiProperty } from '@nestjs/swagger'

import { IsNotEmpty } from 'class-validator'

export class ProductParametersDto {
  @ApiProperty({ example: [1, 2] })
  @IsNotEmpty()
  parameters: number[]
}
