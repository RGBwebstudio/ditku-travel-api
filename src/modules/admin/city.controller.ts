import { Controller, UseGuards } from '@nestjs/common'
import { CityController } from 'src/modules/city/city.controller'
import { CityService } from 'src/modules/city/city.service'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/city')
export class AdminCityController extends CityController {
  constructor(cityService: CityService) {
    super(cityService)
  }
}
