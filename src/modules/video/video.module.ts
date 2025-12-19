import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VideoController } from './video.controller'
import { VideoService } from './video.service'
import { Video } from './entities/video.entity'
import { VideoCategory } from './entities/video-category.entity'
import { VideoCategoryController } from './video-category.controller'
import { VideoCategoryService } from './video-category.service'

@Module({
  imports: [TypeOrmModule.forFeature([Video, VideoCategory])],
  controllers: [VideoController, VideoCategoryController],
  providers: [VideoService, VideoCategoryService],
  exports: [VideoService, VideoCategoryService]
})
export class VideoModule {}
