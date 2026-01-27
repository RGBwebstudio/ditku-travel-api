import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MainPage } from './entities/main-page.entity'
import { MainPageController } from './main-page.controller'
import { MainPageService } from './main-page.service'
import { Post } from '../posts/entities/post.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MainPage, Post])],
  controllers: [MainPageController],
  providers: [MainPageService],
  exports: [MainPageService],
})
export class MainPageModule {}
