import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CookieService } from './cookie.service'
import { CookieController } from './cookie.controller'
import { Cookie } from './entities/cookie.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Cookie])],
  controllers: [CookieController],
  providers: [CookieService]
})
export class CookieModule {}
