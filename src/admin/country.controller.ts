import { Controller, UseGuards } from '@nestjs/common'
import { CountryController } from 'src/country/country.controller'
import { CountryService } from 'src/country/country.service'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/country')
export class AdminCountryController extends CountryController {
  constructor(countryService: CountryService) {
    super(countryService)
  }
}
