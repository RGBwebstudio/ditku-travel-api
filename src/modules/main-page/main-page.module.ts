import { Module } from '@nestjs/common'
import { MainPageService } from './main-page.service'
import { MainPageController } from './main-page.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MainPage } from './entities/main-page.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MainPage])],
  controllers: [MainPageController],
  providers: [MainPageService],
  exports: [MainPageService]
})
export class MainPageModule {}
