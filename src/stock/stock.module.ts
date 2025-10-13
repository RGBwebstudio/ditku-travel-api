import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StockService } from './stock.service'
import { StockController } from './stock.controller'
import { Stock } from './entities/stock.entity'
import { IsExist } from 'src/common/validators/isExist.validator'

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  controllers: [StockController],
  providers: [StockService, IsExist],
  exports: [StockService]
})
export class StockModule {}
