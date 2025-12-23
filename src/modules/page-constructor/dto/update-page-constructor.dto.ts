import { PartialType, ApiPropertyOptional } from '@nestjs/swagger'

import { IsOptional, IsNumber } from 'class-validator'

import { CreatePageConstructorDto } from './create-page-constructor.dto'

export class UpdatePageConstructorDto extends PartialType(CreatePageConstructorDto) {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  id?: number
}
