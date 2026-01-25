import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BlogController } from './blog.controller'
import { BlogService } from './blog.service'
import { BlogPage } from './entities/blog-page.entity'
import { PostCategoryModule } from '../post-category/post-category.module'
import { Post } from '../posts/entities/post.entity'

@Module({
  imports: [TypeOrmModule.forFeature([BlogPage, Post]), PostCategoryModule],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
