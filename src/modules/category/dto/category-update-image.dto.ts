import { PartialType } from '@nestjs/swagger'

import { CategoryCreateImageDto } from './category-create-image.dto'

export class CategoryUpdateImageDto extends PartialType(CategoryCreateImageDto) {}
