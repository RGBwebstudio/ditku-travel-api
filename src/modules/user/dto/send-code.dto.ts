import { PickType } from '@nestjs/mapped-types'

import { UserCreateDto } from './user-create.dto'

export class SendCodeDto extends PickType(UserCreateDto, ['email'] as const) {}
