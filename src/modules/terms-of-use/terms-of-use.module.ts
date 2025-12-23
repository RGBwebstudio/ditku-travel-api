import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TermsOfUse } from './entities/terms-of-use.entity'
import { TermsOfUseController } from './terms-of-use.controller'
import { TermsOfUseService } from './terms-of-use.service'

@Module({
  imports: [TypeOrmModule.forFeature([TermsOfUse])],
  controllers: [TermsOfUseController],
  providers: [TermsOfUseService],
  exports: [TermsOfUseService],
})
export class TermsOfUseModule {}
