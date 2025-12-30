import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { VideoCategory } from './entities/video-category.entity'
import { Video } from './entities/video.entity'
import { VideoCategoryController } from './video-category.controller'
import { VideoCategoryService } from './video-category.service'
import { VideoController } from './video.controller'
import { VideoService } from './video.service'

@Module({
  imports: [TypeOrmModule.forFeature([Video, VideoCategory])],
  controllers: [VideoController, VideoCategoryController],
  providers: [VideoService, VideoCategoryService],
  exports: [VideoService, VideoCategoryService],
})
export class VideoModule {}
