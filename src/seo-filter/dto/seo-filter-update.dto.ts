import { PartialType } from '@nestjs/mapped-types'
import { SeoFilterCreateDto } from './seo-filter-create.dto'

export class SeoFilterUpdateDto extends PartialType(SeoFilterCreateDto) {}
