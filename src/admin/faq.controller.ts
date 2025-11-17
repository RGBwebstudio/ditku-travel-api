import { Controller, UseGuards } from '@nestjs/common'
import { FaqController } from 'src/faq/faq.controller'
import { FaqService } from 'src/faq/faq.service'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/faq')
export class AdminFaqController extends FaqController {
  constructor(faqService: FaqService) {
    super(faqService)
  }
}
