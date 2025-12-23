import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Roadmap } from './entities/roadmap.entity'
import { RoadmapController } from './roadmap.controller'
import { RoadmapService } from './roadmap.service'

@Module({
  imports: [TypeOrmModule.forFeature([Roadmap])],
  controllers: [RoadmapController],
  providers: [RoadmapService],
  exports: [RoadmapService],
})
export class RoadmapModule {}
