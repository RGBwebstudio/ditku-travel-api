import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsString, IsOptional, IsArray, Validate } from 'class-validator'
import { IsExistIdInArray } from 'src/common/validators/isExistIdInArray.validator'

export class ParameterCategoryCreateDto {
  @ApiPropertyOptional({ example: '123' })
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Сорт' })
  @IsString()
  title: string

  @ApiProperty({ example: 0 })
  @IsInt()
  order_in_list: number

  @ApiPropertyOptional({
    example: [1, 2],
    description: 'Array of existing parameter IDs to attach'
  })
  @IsArray()
  @IsOptional()
  @Validate(IsExistIdInArray, ['parameter'])
  parameter_ids?: number[]
}
