import { ApiProperty } from '@nestjs/swagger'

import { IsInt, Min } from 'class-validator'

export class TakeAndSkipDto {
  @ApiProperty({ type: Number, example: 15 })
  @IsInt()
  @Min(0)
  take: number

  @ApiProperty({ type: Number, example: 0 })
  @IsInt()
  @Min(0)
  skip: number
}
