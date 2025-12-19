import { Controller, UseGuards } from '@nestjs/common'
import { ParameterController } from 'src/modules/parameter/parameter.controller'
import { ParameterService } from 'src/modules/parameter/parameter.service'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/parameter')
export class AdminParameterController extends ParameterController {
  constructor(parameterService: ParameterService) {
    super(parameterService)
  }
}
