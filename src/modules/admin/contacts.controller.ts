import { Controller, UseGuards } from '@nestjs/common'

import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'
import { ContactsController } from 'src/modules/contacts/contacts.controller'
import { ContactsService } from 'src/modules/contacts/contacts.service'

@UseGuards(AuthAdminGuard)
@Controller('admin/contacts')
export class AdminContactsController extends ContactsController {
  constructor(contactsService: ContactsService) {
    super(contactsService)
  }
}
