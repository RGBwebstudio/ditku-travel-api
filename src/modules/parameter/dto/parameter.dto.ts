import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsString, Validate, IsInt, IsOptional, ArrayNotEmpty, IsArray } from 'class-validator'
import { IsExistIdInArray } from 'src/common/validators/isExistIdInArray.validator'

export class ParameterDto {
  @ApiProperty({ example: 'Fuji' })
  @IsString()
  title: string

  @ApiPropertyOptional({
    example: [1, 2],
    description: 'Array of existing category IDs to attach',
  })
  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @Validate(IsExistIdInArray, ['parameter_category'])
  category_ids?: number[]

  @ApiPropertyOptional({ example: 0 })
  @IsInt()
  order_in_list: number
}
