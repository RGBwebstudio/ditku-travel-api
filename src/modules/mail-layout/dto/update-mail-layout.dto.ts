import { PartialType } from '@nestjs/swagger'

import { CreateMailLayoutDto } from './create-mail-layout.dto'

export class UpdateMailLayoutDto extends PartialType(CreateMailLayoutDto) {}
