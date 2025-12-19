import { Controller, UseGuards } from '@nestjs/common'
import { MainPageController } from 'src/modules/main-page/main-page.controller'
import { MainPageService } from 'src/modules/main-page/main-page.service'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/main-page')
export class AdminMainPageController extends MainPageController {
  constructor(mainPageService: MainPageService) {
    super(mainPageService)
  }
}
