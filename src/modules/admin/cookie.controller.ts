import { Controller, UseGuards } from '@nestjs/common'
import { CookieController } from 'src/modules/cookie/cookie.controller'
import { CookieService } from 'src/modules/cookie/cookie.service'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/cookie')
export class AdminCookieController extends CookieController {
  constructor(cookieService: CookieService) {
    super(cookieService)
  }
}
