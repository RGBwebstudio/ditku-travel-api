import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SeoBlocksController } from './seo-blocks.controller'
import { SeoBlocksService } from './seo-blocks.service'
import { SeoBlock } from './entities/seo-block.entity'

@Module({
  imports: [TypeOrmModule.forFeature([SeoBlock])],
  controllers: [SeoBlocksController],
  providers: [SeoBlocksService],
  exports: [SeoBlocksService]
})
export class SeoBlocksModule {}
