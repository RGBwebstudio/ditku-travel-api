import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { Request } from 'express'
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
  findOne(@Req() req: Request) {
    return this.service.findOne(req.lang)
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
    // Assuming we update based on language in DTO or default to UA if singleton
    // But existing service requires ID. Let's look at service options.
    // Service has `findOne(lang)`.
    const settings = await this.service.findOne(dto.lang)
    if (settings && settings.id) {
      return this.service.update(settings.id, dto)
    }
    // If not found, create it? Or throw?
    // If generic settings, maybe just create if empty.
    // However, for now, let's just use the first one or create.
    if (!settings || !settings.id) {
      // If it returns {}, it has no ID.
      return this.service.create(dto as CreateGlobalSettingsDto)
    }
  }
}
