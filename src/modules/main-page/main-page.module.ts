import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MainPage } from './entities/main-page.entity'
import { MainPageController } from './main-page.controller'
import { MainPageService } from './main-page.service'

@Module({
  imports: [TypeOrmModule.forFeature([MainPage])],
  controllers: [MainPageController],
  providers: [MainPageService],
  exports: [MainPageService],
})
export class MainPageModule {}
