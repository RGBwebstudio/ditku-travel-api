import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductPromotionController } from './product-promotion.controller'
import { ProductPromotion } from './entities/product-promotion.entity'
import { ProductPromotionTranslate } from './entities/product-promotion-translate.entity'
import { ProductPromotionService } from './product-promotion.service'
import { Product } from 'src/product/entities/product.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductPromotion,
      ProductPromotionTranslate,
      Product
    ])
  ],
  controllers: [ProductPromotionController],
  providers: [ProductPromotionService],
  exports: [ProductPromotionService]
})
export class ProductPromotionModule {}
