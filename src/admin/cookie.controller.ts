import { Controller, UseGuards } from '@nestjs/common'
import { CookieController } from 'src/cookie/cookie.controller'
import { CookieService } from 'src/cookie/cookie.service'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/cookie')
export class AdminCookieController extends CookieController {
  constructor(cookieService: CookieService) {
    super(cookieService)
  }
}
