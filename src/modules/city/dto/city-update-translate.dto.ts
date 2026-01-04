import { ApiProperty, PartialType } from '@nestjs/swagger'

import { IsInt, IsNotEmpty, IsPositive } from 'class-validator'

import { CityCreateTranslateDto } from './city-create-translate.dto'

export class CityUpdateTranslateDto extends PartialType(CityCreateTranslateDto) {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number
}
