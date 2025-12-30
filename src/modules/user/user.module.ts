import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MailSenderModule } from 'src/modules/mail-sender/mail-sernder.module'

import { User } from './entities/user.entity'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => MailSenderModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
