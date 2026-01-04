import { ApiProperty, PartialType } from '@nestjs/swagger'

import { IsInt, IsNotEmpty, IsPositive } from 'class-validator'

import { RoadmapCreateTranslateDto } from './roadmap-create-translate.dto'

export class RoadmapUpdateTranslateDto extends PartialType(RoadmapCreateTranslateDto) {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number
}
