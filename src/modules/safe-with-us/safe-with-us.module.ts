import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SafeWithUs } from './entities/safe-with-us.entity'
import { SafeWithUsController } from './safe-with-us.controller'
import { SafeWithUsService } from './safe-with-us.service'

@Module({
  imports: [TypeOrmModule.forFeature([SafeWithUs])],
  controllers: [SafeWithUsController],
  providers: [SafeWithUsService],
})
export class SafeWithUsModule {}
