import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Promocode } from './entities/promocode.entity'
import { PromocodeController } from './promocode.controller'
import { PromocodeService } from './promocode.service'

@Module({
  imports: [TypeOrmModule.forFeature([Promocode])],
  controllers: [PromocodeController],
  providers: [PromocodeService],
  exports: [PromocodeService],
})
export class PromocodeModule {}
