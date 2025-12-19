import { Controller, UseGuards } from '@nestjs/common'
import { VideoController } from 'src/modules/video/video.controller'
import { VideoService } from 'src/modules/video/video.service'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/video')
export class AdminVideoController extends VideoController {
  constructor(readonly videoService: VideoService) {
    super(videoService)
  }
}
