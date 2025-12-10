import { Controller, UseGuards } from '@nestjs/common'
import { PostController } from 'src/posts/post.controller'
import { PostService } from 'src/posts/post.service'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@UseGuards(AuthAdminGuard)
@Controller('admin/posts')
export class AdminPostController extends PostController {
  constructor(postService: PostService) {
    super(postService)
  }
}
