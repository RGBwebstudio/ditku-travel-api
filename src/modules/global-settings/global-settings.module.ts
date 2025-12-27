import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { GlobalSettings } from './entities/global-settings.entity'
import { GlobalSettingsController } from './global-settings.controller'
import { GlobalSettingsService } from './global-settings.service'

@Module({
  imports: [TypeOrmModule.forFeature([GlobalSettings])],
  controllers: [GlobalSettingsController],
  providers: [GlobalSettingsService],
  exports: [GlobalSettingsService],
})
export class GlobalSettingsModule {}
