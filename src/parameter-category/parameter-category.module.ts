import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ParameterCategoryController } from './parameter-category.controller'
import { ParameterCategoryService } from './parameter-category.service'
import { ParameterCategory } from 'src/parameter-category/entities/parameter-category.entity'
import { ParameterCategoryTranslate } from './entities/category-translate.entity'
import { Parameter } from 'src/parameter/entities/parameter.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([ParameterCategory, ParameterCategoryTranslate, Parameter])
  ],
  controllers: [ParameterCategoryController],
  providers: [ParameterCategoryService],
  exports: [ParameterCategoryService]
})
export class ParameterCategoryModule {}
