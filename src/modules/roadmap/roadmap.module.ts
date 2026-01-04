import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RoadmapTranslate } from './entities/roadmap-translate.entity'
import { Roadmap } from './entities/roadmap.entity'
import { RoadmapController } from './roadmap.controller'
import { RoadmapService } from './roadmap.service'

@Module({
  imports: [TypeOrmModule.forFeature([Roadmap, RoadmapTranslate])],
  controllers: [RoadmapController],
  providers: [RoadmapService],
  exports: [RoadmapService],
})
export class RoadmapModule {}
