import { Controller, UseGuards } from '@nestjs/common'
import { SettingsController } from 'src/settings/settings.controller'
import { SettingsService } from 'src/settings/settings.service'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/settings')
export class AdminSettingsController extends SettingsController {
  constructor(settingsService: SettingsService) {
    super(settingsService)
  }
}
