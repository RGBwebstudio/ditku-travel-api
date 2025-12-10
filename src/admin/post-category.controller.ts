import { Controller, UseGuards } from '@nestjs/common'
import { PostCategoryController } from 'src/post-category/post-category.controller'
import { PostCategoryService } from 'src/post-category/post-category.service'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/post-category')
export class AdminPostCategoryController extends PostCategoryController {
  constructor(postCategoryService: PostCategoryService) {
    super(postCategoryService)
  }
}
