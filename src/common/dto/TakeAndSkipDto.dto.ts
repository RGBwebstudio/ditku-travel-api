import { ApiProperty } from '@nestjs/swagger'

import { IsInt, Min, IsOptional } from 'class-validator'

export class TakeAndSkipDto {
  @ApiProperty({ type: Number, example: 15 })
  @IsInt()
  @Min(0)
  @IsOptional()
  take: number

  @ApiProperty({ type: Number, example: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  skip: number
}
