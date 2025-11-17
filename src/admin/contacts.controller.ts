import { Controller, UseGuards } from '@nestjs/common'
import { ContactsController } from 'src/сontacts/contacts.controller'
import { ContactsService } from 'src/сontacts/contacts.service'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/contacts')
export class AdminContactsController extends ContactsController {
  constructor(contactsService: ContactsService) {
    super(contactsService)
  }
}
