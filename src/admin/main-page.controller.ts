import { Controller, UseGuards } from '@nestjs/common'
import { MainPageController } from 'src/main-page/main-page.controller'
import { MainPageService } from 'src/main-page/main-page.service'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/main-page')
export class AdminMainPageController extends MainPageController {
  constructor(mainPageService: MainPageService) {
    super(mainPageService)
  }
}
