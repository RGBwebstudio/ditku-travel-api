import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Section } from 'src/modules/section/entities/section.entity'

import { SeoFilter } from './entities/seo-filter.entity'
import { SeoFilterController } from './seo-filter.controller'
import { SeoFilterService } from './seo-filter.service'

@Module({
  imports: [TypeOrmModule.forFeature([SeoFilter, Section])],
  controllers: [SeoFilterController],
  providers: [SeoFilterService],
  exports: [SeoFilterService],
})
export class SeoFilterModule {}
