import { Controller, UseGuards } from '@nestjs/common'

import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'
import { SeoBlocksController } from 'src/modules/seo-blocks/seo-blocks.controller'
import { SeoBlocksService } from 'src/modules/seo-blocks/seo-blocks.service'

@UseGuards(AuthAdminGuard)
@Controller('admin/seo-blocks')
export class AdminSeoBlocksController extends SeoBlocksController {
  constructor(seoBlocksService: SeoBlocksService) {
    super(seoBlocksService)
  }
}
