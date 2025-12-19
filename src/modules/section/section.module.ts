import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SectionService } from './section.service'
import { SectionController } from './section.controller'
import { Section } from './entities/section.entity'
import { SectionTranslate } from './entities/section-translate.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Section, SectionTranslate])],
  controllers: [SectionController],
  providers: [SectionService],
  exports: [SectionService]
})
export class SectionModule {}
