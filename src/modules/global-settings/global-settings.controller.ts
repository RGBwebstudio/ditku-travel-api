import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common'
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

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Update global settings' })
  @ApiResponse({ status: 200, description: 'UPDATED' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGlobalSettingsDto) {
    return this.service.update(id, dto)
  }
}
