import { Module } from '@nestjs/common'
import { FaqService } from './faq.service'
import { FaqController } from './faq.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Faq } from './entities/faq.entity'
import { FaqTranslate } from './entities/faq-translate.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Faq, FaqTranslate])],
  controllers: [FaqController],
  providers: [FaqService]
})
export class FaqModule {}
