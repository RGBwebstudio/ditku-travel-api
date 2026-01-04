import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CityController } from './city.controller'
import { CityService } from './city.service'
import { CityTranslate } from './entities/city-translate.entity'
import { City } from './entities/city.entity'

@Module({
  imports: [TypeOrmModule.forFeature([City, CityTranslate])],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService],
})
export class CityModule {}
