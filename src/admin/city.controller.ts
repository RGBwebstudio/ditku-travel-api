import { Controller, UseGuards } from '@nestjs/common'
import { CityController } from 'src/city/city.controller'
import { CityService } from 'src/city/city.service'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/city')
export class AdminCityController extends CityController {
  constructor(cityService: CityService) {
    super(cityService)
  }
}
