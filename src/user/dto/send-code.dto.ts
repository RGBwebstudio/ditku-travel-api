import { UserCreateDto } from './user-create.dto'
import { PickType } from '@nestjs/mapped-types'

export class SendCodeDto extends PickType(UserCreateDto, ['email'] as const) {}
