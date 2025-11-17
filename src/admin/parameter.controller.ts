import { Controller, UseGuards } from '@nestjs/common'
import { ParameterController } from 'src/parameter/parameter.controller'
import { ParameterService } from 'src/parameter/parameter.service'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/parameter')
export class AdminParameterController extends ParameterController {
  constructor(parameterService: ParameterService) {
    super(parameterService)
  }
}
