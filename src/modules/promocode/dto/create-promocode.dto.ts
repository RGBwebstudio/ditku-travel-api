import { ApiProperty } from '@nestjs/swagger'

import { IsNumber, IsString, Min } from 'class-validator'

export class CreatePromocodeDto {
  @ApiProperty({ example: 'SUMMER2025' })
  @IsString()
  title: string

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  discount: number
}
