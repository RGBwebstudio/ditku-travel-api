import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'

import * as dotenv from 'dotenv'
import { User } from 'src/modules/user/entities/user.entity'
import { UserModule } from 'src/modules/user/user.module'

import { AuthController } from './auth.controller'
import { AuthSevice } from './auth.service'

dotenv.config()

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthSevice, ConfigService],
})
export class AuthModule {}
