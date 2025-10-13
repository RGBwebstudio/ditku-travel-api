import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './entities/product.entity'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { Parameter } from 'src/parameter/entities/parameter.entity'
import { Category } from 'src/category/entities/category.entity'
import { ProductImage } from './entities/product-image.entity'
import { ProductTranslate } from './entities/product-translate.entity'
import { IsExist } from 'src/common/validators/isExist.validator'
import { HttpModule } from '@nestjs/axios'
import { RatingModule } from 'src/product-rating/rating.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Parameter,
      ProductImage,
      ProductTranslate,
      Category
    ]),
    HttpModule,
    RatingModule
  ],
  providers: [ProductService, IsExist],
  controllers: [ProductController],
  exports: [ProductService]
})
export class ProductModule {}
