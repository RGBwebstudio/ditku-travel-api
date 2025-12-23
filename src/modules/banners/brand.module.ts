import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { IsExist } from 'src/common/validators/isExist.validator'

import { BannerController } from './banner.controller'
import { BannerService } from './banner.service'
import { BannerImage } from './entities/banner-image.entity'
import { BannerGroup } from './entities/banners.entity'

@Module({
  imports: [TypeOrmModule.forFeature([BannerGroup, BannerImage])],
  controllers: [BannerController],
  providers: [BannerService, IsExist],
  exports: [BannerService],
})
export class BannerModule {}
