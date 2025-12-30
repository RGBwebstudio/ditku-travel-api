import { Controller, UseGuards } from '@nestjs/common'

import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'
import { PostController } from 'src/modules/posts/post.controller'
import { PostService } from 'src/modules/posts/post.service'

@UseGuards(AuthAdminGuard)
@Controller('admin/posts')
export class AdminPostController extends PostController {
  constructor(postService: PostService) {
    super(postService)
  }
}
