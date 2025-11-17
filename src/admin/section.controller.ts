import { Controller, UseGuards } from '@nestjs/common'
import { SectionController } from 'src/section/section.controller'
import { SectionService } from 'src/section/section.service'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/section')
export class AdminSectionController extends SectionController {
  constructor(sectionService: SectionService) {
    super(sectionService)
  }
}
