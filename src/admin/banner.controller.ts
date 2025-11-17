import { Controller, UseGuards } from '@nestjs/common'
import { BannerController } from 'src/banners/banner.controller'
import { BannerService } from 'src/banners/banner.service'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/banner-group')
export class AdminBannerController extends BannerController {
  constructor(bannerService: BannerService) {
    super(bannerService)
  }
}
