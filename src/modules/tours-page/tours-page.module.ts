import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Post } from '../posts/entities/post.entity'
import { ToursPage } from './entities/tours-page.entity'
import { ToursPageController } from './tours-page.controller'
import { ToursPageService } from './tours-page.service'

@Module({
  imports: [TypeOrmModule.forFeature([ToursPage, Post])],
  controllers: [ToursPageController],
  providers: [ToursPageService],
})
export class ToursPageModule {}
