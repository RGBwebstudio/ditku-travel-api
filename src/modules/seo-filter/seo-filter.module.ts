import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SeoFilterTranslate } from './entities/seo-filter-translate.entity'
import { SeoFilter } from './entities/seo-filter.entity'
import { SeoFilterController } from './seo-filter.controller'
import { SeoFilterService } from './seo-filter.service'

@Module({
  imports: [TypeOrmModule.forFeature([SeoFilter, SeoFilterTranslate])],
  controllers: [SeoFilterController],
  providers: [SeoFilterService],
  exports: [SeoFilterService],
})
export class SeoFilterModule {}
