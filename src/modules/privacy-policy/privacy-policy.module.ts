import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PrivacyPolicy } from './entities/privacy-policy.entity'
import { PrivacyPolicyController } from './privacy-policy.controller'
import { PrivacyPolicyService } from './privacy-policy.service'

@Module({
  imports: [TypeOrmModule.forFeature([PrivacyPolicy])],
  controllers: [PrivacyPolicyController],
  providers: [PrivacyPolicyService],
  exports: [PrivacyPolicyService],
})
export class PrivacyPolicyModule {}
