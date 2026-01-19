import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PageConstructorCategory } from './entities/page-constructor-category.entity'
import { PageConstructorCategoryController } from './page-constructor-category.controller'
import { PageConstructorCategoryService } from './page-constructor-category.service'

@Module({
  imports: [TypeOrmModule.forFeature([PageConstructorCategory])],
  controllers: [PageConstructorCategoryController],
  providers: [PageConstructorCategoryService],
  exports: [PageConstructorCategoryService],
})
export class PageConstructorCategoryModule {}
