import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SeoFilterService } from './seo-filter.service'
import { SeoFilterController } from './seo-filter.controller'
import { SeoFilter } from './entities/seo-filter.entity'
import { Section } from 'src/modules/section/entities/section.entity'

@Module({
  imports: [TypeOrmModule.forFeature([SeoFilter, Section])],
  controllers: [SeoFilterController],
  providers: [SeoFilterService],
  exports: [SeoFilterService]
})
export class SeoFilterModule {}
