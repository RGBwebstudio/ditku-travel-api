import { PartialType } from '@nestjs/swagger'

import { CreatePageConstructorCategoryDto } from './create-page-constructor-category.dto'

export class UpdatePageConstructorCategoryDto extends PartialType(CreatePageConstructorCategoryDto) {}
