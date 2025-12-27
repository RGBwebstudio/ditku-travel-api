import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { TypeOrmModule } from '@nestjs/typeorm'

import { memoryStorage } from 'multer'

import { ImageAdminController } from './controllers/image-admin.controller'
import { ImageCategoryAdminController } from './controllers/image-category-admin.controller'
import { ImageCategory } from './entities/image-category.entity'
import { Image } from './entities/image.entity'
import { ImageCategoryService } from './services/image-category.service'
import { ImageService } from './services/image.service'
import { S3Service } from './services/s3.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Image, ImageCategory]),
    ConfigModule,
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [ImageAdminController, ImageCategoryAdminController],
  providers: [ImageService, ImageCategoryService, S3Service],
  exports: [ImageService, ImageCategoryService, S3Service],
})
export class GalleryModule {}
