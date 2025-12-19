import { PartialType } from '@nestjs/swagger'
import { ParameterCategoryCreateDto } from './parameter-category-create.dto'

export class ParameterCategoryUpdateDto extends PartialType(
  ParameterCategoryCreateDto
) {}
