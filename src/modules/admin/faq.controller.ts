import { Controller, UseGuards } from '@nestjs/common'
import { FaqController } from 'src/modules/faq/faq.controller'
import { FaqService } from 'src/modules/faq/faq.service'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/faq')
export class AdminFaqController extends FaqController {
  constructor(faqService: FaqService) {
    super(faqService)
  }
}
