import { Controller, UseGuards } from '@nestjs/common'

import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'
import { SeoFilterController } from 'src/modules/seo-filter/seo-filter.controller'
import { SeoFilterService } from 'src/modules/seo-filter/seo-filter.service'

@UseGuards(AuthAdminGuard)
@Controller('admin/seo-filter')
export class AdminSeoFilterController extends SeoFilterController {
  constructor(seoFilterService: SeoFilterService) {
    super(seoFilterService)
  }
}
