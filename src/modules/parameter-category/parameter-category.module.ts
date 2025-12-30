import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Parameter } from 'src/modules/parameter/entities/parameter.entity'
import { ParameterCategory } from 'src/modules/parameter-category/entities/parameter-category.entity'

import { ParameterCategoryTranslate } from './entities/category-translate.entity'
import { ParameterCategoryController } from './parameter-category.controller'
import { ParameterCategoryService } from './parameter-category.service'

@Module({
  imports: [TypeOrmModule.forFeature([ParameterCategory, ParameterCategoryTranslate, Parameter])],
  controllers: [ParameterCategoryController],
  providers: [ParameterCategoryService],
  exports: [ParameterCategoryService],
})
export class ParameterCategoryModule {}
