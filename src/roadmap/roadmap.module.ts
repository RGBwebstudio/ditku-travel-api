import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoadmapController } from './roadmap.controller'
import { RoadmapService } from './roadmap.service'
import { Roadmap } from './entities/roadmap.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Roadmap])],
  controllers: [RoadmapController],
  providers: [RoadmapService],
  exports: [RoadmapService]
})
export class RoadmapModule {}
