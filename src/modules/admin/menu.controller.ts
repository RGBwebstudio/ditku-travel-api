import { Controller, UseGuards } from '@nestjs/common'
import { MenuController } from 'src/modules/menu/menu.controller'
import { MenuService } from 'src/modules/menu/menu.service'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/menu')
export class AdminMenuController extends MenuController {
  constructor(menuService: MenuService) {
    super(menuService)
  }
}
