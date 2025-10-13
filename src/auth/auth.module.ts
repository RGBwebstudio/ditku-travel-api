import { Module } from '@nestjs/common'
import { AuthSevice } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/user/entities/user.entity'
import { AuthController } from './auth.controller'
import * as dotenv from 'dotenv'
import { UserModule } from 'src/user/user.module'
import { ConfigService } from '@nestjs/config'
import { CartModule } from 'src/cart/cart.module'

dotenv.config()

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' }
    }),
    CartModule,
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthSevice, ConfigService]
})
export class AuthModule {}
