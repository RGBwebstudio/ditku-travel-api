import { Controller, UseGuards } from '@nestjs/common'

import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'
import { CountryController } from 'src/modules/country/country.controller'
import { CountryService } from 'src/modules/country/country.service'

@UseGuards(AuthAdminGuard)
@Controller('admin/country')
export class AdminCountryController extends CountryController {
  constructor(countryService: CountryService) {
    super(countryService)
  }
}
