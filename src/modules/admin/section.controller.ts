import { Controller, UseGuards } from '@nestjs/common'

import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'
import { SectionController } from 'src/modules/section/section.controller'
import { SectionService } from 'src/modules/section/section.service'

@UseGuards(AuthAdminGuard)
@Controller('admin/section')
export class AdminSectionController extends SectionController {
  constructor(sectionService: SectionService) {
    super(sectionService)
  }
}
