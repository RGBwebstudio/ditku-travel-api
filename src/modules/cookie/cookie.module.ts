import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CookieController } from './cookie.controller'
import { CookieService } from './cookie.service'
import { Cookie } from './entities/cookie.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Cookie])],
  controllers: [CookieController],
  providers: [CookieService],
  exports: [CookieService],
})
export class CookieModule {}
