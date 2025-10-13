import { PartialType } from '@nestjs/swagger'
import { CreateContactsDto } from './create-contacts.dto'

export class UpdateContactsDto extends PartialType(CreateContactsDto) {}
