import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { IsExist } from 'src/common/validators/isExist.validator'
import { Category } from 'src/modules/category/entities/category.entity'
import { FormatGroup } from 'src/modules/format-group/entities/format-group.entity'
import { Parameter } from 'src/modules/parameter/entities/parameter.entity'
import { RatingModule } from 'src/modules/product-rating/rating.module'
import { Section } from 'src/modules/section/entities/section.entity'

import { ProductImage } from './entities/product-image.entity'
import { ProductTranslate } from './entities/product-translate.entity'
import { Product } from './entities/product.entity'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Parameter, FormatGroup, ProductImage, ProductTranslate, Category, Section]),
    HttpModule,
    RatingModule,
  ],
  providers: [ProductService, IsExist],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
