import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PageConstructorService } from './page-constructor.service'
import { PageConstructorController } from './page-constructor.controller'
import { PageConstructor } from './entities/page-constructor.entity'

@Module({
  imports: [TypeOrmModule.forFeature([PageConstructor])],
  controllers: [PageConstructorController],
  providers: [PageConstructorService],
  exports: [PageConstructorService]
})
export class PageConstructorModule {}
