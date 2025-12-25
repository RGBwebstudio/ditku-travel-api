import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Image } from './entities/image.entity'
import { ImageCategory } from './entities/image-category.entity'
import { ImageAdminController } from './controllers/image-admin.controller'
import { ImageCategoryAdminController } from './controllers/image-category-admin.controller'
import { ImageService } from './services/image.service'
import { ImageCategoryService } from './services/image-category.service'
import { S3Service } from './services/s3.service'
import { ConfigModule } from '@nestjs/config'

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
