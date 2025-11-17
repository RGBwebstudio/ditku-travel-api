import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PrivacyPolicyService } from './privacy-policy.service'
import { PrivacyPolicyController } from './privacy-policy.controller'
import { PrivacyPolicy } from './entities/privacy-policy.entity'

@Module({
  imports: [TypeOrmModule.forFeature([PrivacyPolicy])],
  controllers: [PrivacyPolicyController],
  providers: [PrivacyPolicyService],
  exports: [PrivacyPolicyService]
})
export class PrivacyPolicyModule {}
