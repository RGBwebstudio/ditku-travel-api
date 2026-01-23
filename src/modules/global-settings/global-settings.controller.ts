import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

import { CreateGlobalSettingsDto } from './dto/create-global-settings.dto'
import { UpdateGlobalSettingsDto } from './dto/update-global-settings.dto'
import { GlobalSettingsService } from './global-settings.service'

@ApiTags('Глобальні налаштування')
@Controller('global-settings')
export class GlobalSettingsController {
  constructor(private readonly service: GlobalSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get global settings by language' })
  @ApiResponse({ status: 200, description: 'SUCCESS' })
  findOne() {
    return this.service.findOne()
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Create global settings' })
  @ApiResponse({ status: 201, description: 'CREATED' })
  create(@Body() dto: CreateGlobalSettingsDto) {
    return this.service.create(dto)
  }

  @Patch()
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Update global settings' })
  @ApiResponse({ status: 200, description: 'UPDATED' })
  async update(@Body() dto: UpdateGlobalSettingsDto) {
    const settings = await this.service.findOne()
    if (settings && settings.id) {
      return this.service.update(settings.id, dto)
    }
    if (!settings || !settings.id) {
      return this.service.create(dto as CreateGlobalSettingsDto)
    }
  }
}
