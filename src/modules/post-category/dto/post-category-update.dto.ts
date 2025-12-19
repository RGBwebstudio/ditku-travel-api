import { PartialType } from '@nestjs/swagger'
import { PostCategoryCreateDto } from './post-category-create.dto'

export class PostCategoryUpdateDto extends PartialType(PostCategoryCreateDto) {}
