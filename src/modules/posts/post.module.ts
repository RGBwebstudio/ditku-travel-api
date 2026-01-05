import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { IsExist } from 'src/common/validators/isExist.validator'
import { PostCategory } from 'src/modules/post-category/entities/post-category.entity'

import { PostImage } from './entities/post-image.entity'
import { PostSectionImage } from './entities/post-section-image.entity'
import { PostSectionTranslate } from './entities/post-section-translate.entity'
import { PostSection } from './entities/post-section.entity'
import { PostTranslate } from './entities/post-translate.entity'
import { Post } from './entities/post.entity'
import { PostController } from './post.controller'
import { PostService } from './post.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      PostTranslate,
      PostImage,
      PostCategory,
      PostSection,
      PostSectionTranslate,
      PostSectionImage,
    ]),
  ],
  controllers: [PostController],
  providers: [PostService, IsExist],
  exports: [PostService],
})
export class PostModule {}
