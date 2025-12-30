import { Controller, UseGuards } from '@nestjs/common'

import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'
import { ParameterController } from 'src/modules/parameter/parameter.controller'
import { ParameterService } from 'src/modules/parameter/parameter.service'

@UseGuards(AuthAdminGuard)
@Controller('admin/parameter')
export class AdminParameterController extends ParameterController {
  constructor(parameterService: ParameterService) {
    super(parameterService)
  }
}
