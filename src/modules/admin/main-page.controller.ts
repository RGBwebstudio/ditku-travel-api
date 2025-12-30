import { Controller, UseGuards } from '@nestjs/common'

import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'
import { MainPageController } from 'src/modules/main-page/main-page.controller'
import { MainPageService } from 'src/modules/main-page/main-page.service'

@UseGuards(AuthAdminGuard)
@Controller('admin/main-page')
export class AdminMainPageController extends MainPageController {
  constructor(mainPageService: MainPageService) {
    super(mainPageService)
  }
}
