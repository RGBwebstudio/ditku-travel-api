import { PartialType } from '@nestjs/swagger'

import { CreateSafeWithUsDto } from './create-safe-with-us.dto'

export class UpdateSafeWithUsDto extends PartialType(CreateSafeWithUsDto) {}
