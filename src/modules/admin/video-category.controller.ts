import { Controller, UseGuards } from '@nestjs/common'

import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'
import { VideoCategoryController } from 'src/modules/video/video-category.controller'
import { VideoCategoryService } from 'src/modules/video/video-category.service'

@UseGuards(AuthAdminGuard)
@Controller('admin/video-category')
export class AdminVideoCategoryController extends VideoCategoryController {
  constructor(readonly videoCategoryService: VideoCategoryService) {
    super(videoCategoryService)
  }
}
