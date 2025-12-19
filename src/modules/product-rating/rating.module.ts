import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RatingService } from './rating.service'
import { RatingController } from './rating.controller'
import { Rating } from './entities/rating.entity'
import { IsExist } from 'src/common/validators/isExist.validator'

@Module({
  imports: [TypeOrmModule.forFeature([Rating])],
  controllers: [RatingController],
  providers: [RatingService, IsExist],
  exports: [RatingService]
})
export class RatingModule {}
