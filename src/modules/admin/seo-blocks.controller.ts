import { Controller, UseGuards } from '@nestjs/common'
import { SeoBlocksController } from 'src/modules/seo-blocks/seo-blocks.controller'
import { SeoBlocksService } from 'src/modules/seo-blocks/seo-blocks.service'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/seo-blocks')
export class AdminSeoBlocksController extends SeoBlocksController {
  constructor(seoBlocksService: SeoBlocksService) {
    super(seoBlocksService)
  }
}
