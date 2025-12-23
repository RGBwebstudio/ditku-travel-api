import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { DAPController } from './dap.controller'
import { DAPService } from './dap.service'
import { DAPTranslates } from './entities/dap-translate.entity'
import { DAP } from './entities/dap.entity'

@Module({
  imports: [TypeOrmModule.forFeature([DAP, DAPTranslates])],
  controllers: [DAPController],
  providers: [DAPService],
  exports: [DAPService],
})
export class DAPModule {}
