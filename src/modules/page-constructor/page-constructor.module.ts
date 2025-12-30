import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PageConstructor } from './entities/page-constructor.entity'
import { PageConstructorController } from './page-constructor.controller'
import { PageConstructorService } from './page-constructor.service'

@Module({
  imports: [TypeOrmModule.forFeature([PageConstructor])],
  controllers: [PageConstructorController],
  providers: [PageConstructorService],
  exports: [PageConstructorService],
})
export class PageConstructorModule {}
