import { Controller, UseGuards } from '@nestjs/common'

import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'
import { MenuController } from 'src/modules/menu/menu.controller'
import { MenuService } from 'src/modules/menu/menu.service'

@UseGuards(AuthAdminGuard)
@Controller('admin/menu')
export class AdminMenuController extends MenuController {
  constructor(menuService: MenuService) {
    super(menuService)
  }
}
