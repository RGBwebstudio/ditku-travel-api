import { PartialType } from '@nestjs/swagger'
import { CreateSeoBlockDto } from './create-seo-block.dto'

export class UpdateSeoBlockDto extends PartialType(CreateSeoBlockDto) {}
