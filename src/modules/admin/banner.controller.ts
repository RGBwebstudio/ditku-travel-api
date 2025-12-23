import { Controller, UseGuards } from '@nestjs/common'

import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'
import { BannerController } from 'src/modules/banners/banner.controller'
import { BannerService } from 'src/modules/banners/banner.service'

@UseGuards(AuthAdminGuard)
@Controller('admin/banner-group')
export class AdminBannerController extends BannerController {
  constructor(bannerService: BannerService) {
    super(bannerService)
  }
}
