import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PostCategoryTranslate } from './entities/post-category-translate.entity'
import { PostCategory } from './entities/post-category.entity'
import { PostCategoryController } from './post-category.controller'
import { PostCategoryService } from './post-category.service'
import { Post } from '../posts/entities/post.entity'

@Module({
  imports: [TypeOrmModule.forFeature([PostCategory, PostCategoryTranslate, Post])],
  controllers: [PostCategoryController],
  providers: [PostCategoryService],
  exports: [PostCategoryService],
})
export class PostCategoryModule {}
