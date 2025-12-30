import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SectionTranslate } from './entities/section-translate.entity'
import { Section } from './entities/section.entity'
import { SectionController } from './section.controller'
import { SectionService } from './section.service'

@Module({
  imports: [TypeOrmModule.forFeature([Section, SectionTranslate])],
  controllers: [SectionController],
  providers: [SectionService],
  exports: [SectionService],
})
export class SectionModule {}
