import { ApiProperty, PartialType } from '@nestjs/swagger'
import { MeasurementCreateTranslateDto } from './measurement-create-translate.dto'
import { IsInt } from 'class-validator'

export class MeasurementUpdateTranslateDto extends PartialType(
  MeasurementCreateTranslateDto
) {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number
}
