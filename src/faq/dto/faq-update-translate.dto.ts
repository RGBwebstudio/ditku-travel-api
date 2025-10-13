import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { FaqCreateTranslateDto } from './faq-create-translate.dto'

export class FaqUpdateTranslateDto extends PartialType(FaqCreateTranslateDto) {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number
}
