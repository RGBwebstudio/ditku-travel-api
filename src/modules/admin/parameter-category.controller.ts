import { Controller, UseGuards } from '@nestjs/common'
import { ParameterCategoryController } from 'src/modules/parameter-category/parameter-category.controller'
import { ParameterCategoryService } from 'src/modules/parameter-category/parameter-category.service'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/parameter-category')
export class AdminParameterCategoryController extends ParameterCategoryController {
  constructor(parameterCategoryService: ParameterCategoryService) {
    super(parameterCategoryService)
  }
}
