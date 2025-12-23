import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CountryController } from './country.controller'
import { CountryService } from './country.service'
import { CountryTranslate } from './entities/country-translate.entity'
import { Country } from './entities/country.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Country, CountryTranslate])],
  controllers: [CountryController],
  providers: [CountryService],
  exports: [CountryService],
})
export class CountryModule {}
