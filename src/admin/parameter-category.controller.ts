import { Controller, UseGuards } from '@nestjs/common'
import { ParameterCategoryController } from 'src/parameter-category/parameter-category.controller'
import { ParameterCategoryService } from 'src/parameter-category/parameter-category.service'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/parameter-category')
export class AdminParameterCategoryController extends ParameterCategoryController {
  constructor(parameterCategoryService: ParameterCategoryService) {
    super(parameterCategoryService)
  }
}
