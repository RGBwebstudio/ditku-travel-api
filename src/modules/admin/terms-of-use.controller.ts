import { Controller, UseGuards, Get } from '@nestjs/common'

import { Request } from 'express'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'
import { TermsOfUse } from 'src/modules/terms-of-use/entities/terms-of-use.entity'
import { TermsOfUseController } from 'src/modules/terms-of-use/terms-of-use.controller'
import { TermsOfUseService } from 'src/modules/terms-of-use/terms-of-use.service'

@UseGuards(AuthAdminGuard)
@Controller('admin/terms-of-use')
export class AdminTermsOfUseController extends TermsOfUseController {
  constructor(service: TermsOfUseService) {
    super(service)
  }

  @Get(':lang')
  async findOne(req: Request): Promise<TermsOfUse> {
    const lang = req.lang
    const result = await this.service.findOne(lang)
    return result
  }
}
