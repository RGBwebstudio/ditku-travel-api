import { Module } from '@nestjs/common'
import { AuthSevice } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/modules/user/entities/user.entity'
import { AuthController } from './auth.controller'
import * as dotenv from 'dotenv'
import { UserModule } from 'src/modules/user/user.module'
import { ConfigService } from '@nestjs/config'

dotenv.config()

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' }
    }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthSevice, ConfigService]
})
export class AuthModule {}
