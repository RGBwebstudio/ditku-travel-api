import { ApiPropertyOptional, PartialType } from '@nestjs/swagger'

import { IsOptional, IsString } from 'class-validator'

import { CreateRoadmapDto } from './create-roadmap.dto'

export class UpdateRoadmapDto extends PartialType(CreateRoadmapDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_en?: string
}
