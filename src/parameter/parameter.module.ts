import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Parameter } from './entities/parameter.entity'
import { ParameterController } from './parameter.controller'
import { ParameterService } from './parameter.service'
import { ParameterCategoryModule } from 'src/parameter-category/parameter-category.module'
import { ParameterCategory } from 'src/parameter-category/entities/parameter-category.entity'
import { ParameterTranslate } from './entities/category-translate.entity'
import { IsExistIdInArray } from 'src/common/validators/isExistIdInArray.validator'
import { Category } from 'src/category/entities/category.entity'
import { Product } from 'src/product/entities/product.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Parameter,
      ParameterCategory,
      ParameterTranslate,
      Product
    ]),
    ParameterCategoryModule
  ],
  controllers: [ParameterController],
  providers: [ParameterService, IsExistIdInArray],
  exports: [ParameterService]
})
export class ParameterModule {}
