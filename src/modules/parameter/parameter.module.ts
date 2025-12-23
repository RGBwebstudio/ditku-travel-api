import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { IsExistIdInArray } from 'src/common/validators/isExistIdInArray.validator'
import { Category } from 'src/modules/category/entities/category.entity'
import { ParameterCategory } from 'src/modules/parameter-category/entities/parameter-category.entity'
import { ParameterCategoryModule } from 'src/modules/parameter-category/parameter-category.module'
import { Product } from 'src/modules/product/entities/product.entity'

import { ParameterTranslate } from './entities/category-translate.entity'
import { Parameter } from './entities/parameter.entity'
import { ParameterController } from './parameter.controller'
import { ParameterService } from './parameter.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Parameter, ParameterCategory, ParameterTranslate, Product]),
    ParameterCategoryModule,
  ],
  controllers: [ParameterController],
  providers: [ParameterService, IsExistIdInArray],
  exports: [ParameterService],
})
export class ParameterModule {}
