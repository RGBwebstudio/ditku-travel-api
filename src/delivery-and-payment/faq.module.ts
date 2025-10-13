import { Module } from '@nestjs/common'
import { DAPService } from './dap.service'
import { DAPController } from './dap.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DAP } from './entities/dap.entity'
import { DAPTranslates } from './entities/dap-translate.entity'

@Module({
  imports: [TypeOrmModule.forFeature([DAP, DAPTranslates])],
  controllers: [DAPController],
  providers: [DAPService]
})
export class DAPModule {}
