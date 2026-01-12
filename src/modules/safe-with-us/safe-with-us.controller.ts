import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { Request } from 'express'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

import { UpdateSafeWithUsDto } from './dto/update-safe-with-us.dto'
import { SafeWithUsService } from './safe-with-us.service'

@ApiTags('Safe With Us')
@Controller('admin/safe-with-us')
export class SafeWithUsController {
  constructor(private readonly service: SafeWithUsService) {}

  @Get(':lang')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Entity retrieved successfully',
  })
  @ApiOperation({ summary: 'Get Safe With Us content by language' })
  findOne(@Req() req: Request) {
    // req.lang is likely populated by middleware or we use param if consistent with other modules
    // Using req.lang if available, otherwise defaulting or using basic param handling requires check
    // Based on PrivacyPolicy controller: it uses @Req() req and req.lang
    return this.service.findOne(req.lang)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Entity updated/created successfully',
  })
  @ApiOperation({ summary: 'Update Safe With Us content' })
  update(@Body() dto: UpdateSafeWithUsDto) {
    return this.service.update(dto)
  }
}
