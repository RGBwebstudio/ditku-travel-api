import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { IsExist } from 'src/common/validators/isExist.validator'
import { Category } from 'src/modules/category/entities/category.entity'
import { FormatGroup } from 'src/modules/format-group/entities/format-group.entity'
import { Parameter } from 'src/modules/parameter/entities/parameter.entity'
import { Post } from 'src/modules/posts/entities/post.entity'
import { Rating } from 'src/modules/product-rating/entities/rating.entity'
import { RatingModule } from 'src/modules/product-rating/rating.module'
import { Section } from 'src/modules/section/entities/section.entity'
import { SeoFilter } from 'src/modules/seo-filter/entities/seo-filter.entity'

import { ProductImage } from './entities/product-image.entity'
import { ProductProgramImage } from './entities/product-program-image.entity'
import { ProductProgramTranslate } from './entities/product-program-translate.entity'
import { ProductProgram } from './entities/product-program.entity'
import { ProductSectionTranslate } from './entities/product-section-translate.entity'
import { ProductSection } from './entities/product-section.entity'
import { ProductTranslate } from './entities/product-translate.entity'
import { Product } from './entities/product.entity'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Parameter,
      FormatGroup,
      ProductImage,
      ProductTranslate,
      ProductProgram,
      ProductProgramImage,
      ProductProgramTranslate,
      ProductSection,
      ProductSectionTranslate,
      Category,
      Section,
      SeoFilter,
      Rating,
      Post,
    ]),
    HttpModule,
    RatingModule,
  ],
  providers: [ProductService, IsExist],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
