import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FormatGroup } from './entities/format-group.entity'
import { FormatGroupController } from './format-group.controller'
import { FormatGroupService } from './format-group.service'

@Module({
  imports: [TypeOrmModule.forFeature([FormatGroup])],
  controllers: [FormatGroupController],
  providers: [FormatGroupService],
  exports: [FormatGroupService],
})
export class FormatGroupModule {}
