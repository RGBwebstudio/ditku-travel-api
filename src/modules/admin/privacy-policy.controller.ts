import { Controller, UseGuards } from '@nestjs/common'
import { PrivacyPolicyController } from 'src/modules/privacy-policy/privacy-policy.controller'
import { PrivacyPolicyService } from 'src/modules/privacy-policy/privacy-policy.service'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/privacy-policy')
export class AdminPrivacyPolicyController extends PrivacyPolicyController {
  constructor(service: PrivacyPolicyService) {
    super(service)
  }
}
