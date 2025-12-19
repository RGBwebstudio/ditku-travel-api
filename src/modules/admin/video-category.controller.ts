import { Controller, UseGuards } from '@nestjs/common'
import { VideoCategoryController } from 'src/modules/video/video-category.controller'
import { VideoCategoryService } from 'src/modules/video/video-category.service'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/video-category')
export class AdminVideoCategoryController extends VideoCategoryController {
  constructor(readonly videoCategoryService: VideoCategoryService) {
    super(videoCategoryService)
  }
}
