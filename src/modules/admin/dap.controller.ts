import { Controller, UseGuards } from '@nestjs/common'
import { DAPController } from 'src/modules/delivery-and-payment/dap.controller'
import { DAPService } from 'src/modules/delivery-and-payment/dap.service'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/delivery-and-payment')
export class AdminDapController extends DAPController {
  constructor(dapService: DAPService) {
    super(dapService)
  }
}
