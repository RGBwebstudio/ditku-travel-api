import { forwardRef, Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { MailSenderModule } from 'src/mail-sender/mail-sernder.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => MailSenderModule)
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
