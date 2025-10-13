import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PriceService } from './price.service'
import { PriceController } from './price.controller'
import { Price } from './entities/price.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Price])],
  controllers: [PriceController],
  providers: [PriceService],
  exports: [PriceService]
})
export class PriceModule {}
