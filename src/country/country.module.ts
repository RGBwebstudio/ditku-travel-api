import { Module } from '@nestjs/common'
import { CountryService } from './country.service'
import { CountryController } from './country.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Country } from './entities/country.entity'
import { CountryTranslate } from './entities/country-translate.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Country, CountryTranslate])],
  controllers: [CountryController],
  providers: [CountryService],
  exports: [CountryService]
})
export class CountryModule {}
