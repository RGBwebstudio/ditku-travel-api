import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BannerService } from './banner.service'
import { BannerController } from './banner.controller'
import { BannerGroup } from './entities/banners.entity'
import { IsExist } from 'src/common/validators/isExist.validator'
import { BannerImage } from './entities/banner-image.entity'

@Module({
  imports: [TypeOrmModule.forFeature([BannerGroup, BannerImage])],
  controllers: [BannerController],
  providers: [BannerService, IsExist],
  exports: [BannerService]
})
export class BannerModule {}
