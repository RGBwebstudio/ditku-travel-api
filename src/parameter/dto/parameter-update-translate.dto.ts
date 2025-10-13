import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { ParameterCreateTranslateDto } from './parameter-create-translate.dto'

export class ParameterUpdateTranslateDto extends PartialType(
  ParameterCreateTranslateDto
) {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number
}
