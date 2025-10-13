import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MeasurementService } from './measurement.service'
import { MeasurmenetController } from './measurement.controller'
import { Measurement } from './entities/measurement.entity'
import { MeasurementTranslate } from './entities/measurement-translate.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Measurement, MeasurementTranslate])],
  controllers: [MeasurmenetController],
  providers: [MeasurementService],
  exports: [MeasurementService]
})
export class MeasurementModule {}
