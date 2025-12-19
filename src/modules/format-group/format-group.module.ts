import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FormatGroupController } from './format-group.controller'
import { FormatGroupService } from './format-group.service'
import { FormatGroup } from './entities/format-group.entity'

@Module({
  imports: [TypeOrmModule.forFeature([FormatGroup])],
  controllers: [FormatGroupController],
  providers: [FormatGroupService],
  exports: [FormatGroupService]
})
export class FormatGroupModule {}
