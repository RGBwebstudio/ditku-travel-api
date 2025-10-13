import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { CountryCreateTranslateDto } from './country-create-translate.dto'

export class CountryUpdateTranslateDto extends PartialType(
  CountryCreateTranslateDto
) {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number
}
