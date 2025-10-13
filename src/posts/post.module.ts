import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Post } from './entities/post.entity'
import { PostTranslate } from './entities/post-translate.entity'
import { PostImage } from './entities/post-image.entity'
import { Category } from 'src/category/entities/category.entity'

import { PostService } from './post.service'
import { PostController } from './post.controller'

import { IsExist } from 'src/common/validators/isExist.validator'

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostTranslate, PostImage, Category])
  ],
  controllers: [PostController],
  providers: [PostService, IsExist],
  exports: [PostService]
})
export class PostModule {}
