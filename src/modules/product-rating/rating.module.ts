import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { IsExist } from 'src/common/validators/isExist.validator'

import { Rating } from './entities/rating.entity'
import { RatingController } from './rating.controller'
import { RatingService } from './rating.service'

@Module({
  imports: [TypeOrmModule.forFeature([Rating])],
  controllers: [RatingController],
  providers: [RatingService, IsExist],
  exports: [RatingService],
})
export class RatingModule {}
