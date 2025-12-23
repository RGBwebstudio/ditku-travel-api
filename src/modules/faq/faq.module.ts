import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FaqTranslate } from './entities/faq-translate.entity'
import { Faq } from './entities/faq.entity'
import { FaqController } from './faq.controller'
import { FaqService } from './faq.service'

@Module({
  imports: [TypeOrmModule.forFeature([Faq, FaqTranslate])],
  controllers: [FaqController],
  providers: [FaqService],
  exports: [FaqService],
})
export class FaqModule {}
