import { PartialType } from '@nestjs/swagger'
import { SectionCreateDto } from './section-create.dto'

export class SectionUpdateDto extends PartialType(SectionCreateDto) {}
