import { Module } from '@nestjs/common'
import { SmsSenderService } from './sms-sender.service'
import { SmsSenderController } from './sms-sender.controller'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5
    })
  ],
  controllers: [SmsSenderController],
  providers: [SmsSenderService]
})
export class SmsSenderModule {}
