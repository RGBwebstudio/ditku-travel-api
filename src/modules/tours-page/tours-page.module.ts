import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ToursPage } from './entities/tours-page.entity'
import { ToursPageController } from './tours-page.controller'
import { ToursPageService } from './tours-page.service'

@Module({
  imports: [TypeOrmModule.forFeature([ToursPage])],
  controllers: [ToursPageController],
  providers: [ToursPageService],
})
export class ToursPageModule {}
