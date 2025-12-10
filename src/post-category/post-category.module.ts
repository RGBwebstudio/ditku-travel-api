import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostCategory } from './entities/post-category.entity'
import { PostCategoryTranslate } from './entities/post-category-translate.entity'
import { PostCategoryService } from './post-category.service'
import { PostCategoryController } from './post-category.controller'

@Module({
  imports: [TypeOrmModule.forFeature([PostCategory, PostCategoryTranslate])],
  controllers: [PostCategoryController],
  providers: [PostCategoryService],
  exports: [PostCategoryService]
})
export class PostCategoryModule {}
