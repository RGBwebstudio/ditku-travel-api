import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailLayout } from './entities/mail-layout.entity'
import { MailLayoutController } from './mail-layout.controller'
import { MailLayoutService } from './mail-layout.service'

@Module({
  imports: [TypeOrmModule.forFeature([MailLayout])],
  providers: [MailLayoutService],
  controllers: [MailLayoutController],
  exports: [MailLayoutService]
})
export class MailLayoutModule {}
