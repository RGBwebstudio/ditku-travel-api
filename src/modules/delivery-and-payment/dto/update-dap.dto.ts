import { PartialType } from '@nestjs/swagger'

import { CreateDAPDto } from './create-dap.dto'

export class UpdateDAPDto extends PartialType(CreateDAPDto) {}
