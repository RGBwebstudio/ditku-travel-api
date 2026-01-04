import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsArray, IsInt, IsOptional, IsString, Validate } from 'class-validator'
import { IsExistIdInArray } from 'src/common/validators/isExistIdInArray.validator'

export class ParameterCategoryUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  order_in_list?: number

  @ApiPropertyOptional({
    example: [1, 2],
    description: 'Array of existing parameter IDs to attach',
  })
  @IsArray()
  @IsOptional()
  @Validate(IsExistIdInArray, ['parameter'])
  parameter_ids?: number[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string
}
