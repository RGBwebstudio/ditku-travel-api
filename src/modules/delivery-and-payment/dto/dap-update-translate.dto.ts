import { ApiProperty, PartialType } from '@nestjs/swagger'

import { IsInt } from 'class-validator'

import { DAPCreateTranslateDto } from './dap-create-translate.dto'

export class DAPUpdateTranslateDto extends PartialType(DAPCreateTranslateDto) {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number
}
