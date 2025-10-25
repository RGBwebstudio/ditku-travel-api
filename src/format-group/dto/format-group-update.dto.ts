import { PartialType } from '@nestjs/swagger'
import { FormatGroupCreateDto } from './format-group-create.dto'

export class FormatGroupUpdateDto extends PartialType(FormatGroupCreateDto) {}
