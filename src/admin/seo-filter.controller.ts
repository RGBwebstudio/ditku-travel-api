import { Controller, UseGuards } from '@nestjs/common'
import { SeoFilterController } from 'src/seo-filter/seo-filter.controller'
import { SeoFilterService } from 'src/seo-filter/seo-filter.service'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/seo-filter')
export class AdminSeoFilterController extends SeoFilterController {
  constructor(seoFilterService: SeoFilterService) {
    super(seoFilterService)
  }
}
