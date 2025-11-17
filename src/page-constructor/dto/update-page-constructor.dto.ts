import { PartialType } from '@nestjs/swagger'
import { CreatePageConstructorDto } from './create-page-constructor.dto'

export class UpdatePageConstructorDto extends PartialType(
  CreatePageConstructorDto
) {}
