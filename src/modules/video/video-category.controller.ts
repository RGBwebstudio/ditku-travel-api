import { Controller, Get, Post, Body, Param, ParseIntPipe, Put, Delete, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

import { Request } from 'express'
import { LANG } from 'src/common/enums/translation.enum'

import { CreateVideoCategoryDto } from './dto/create-video-category.dto'
import { UpdateVideoCategoryDto } from './dto/update-video-category.dto'
import { VideoCategoryService } from './video-category.service'

@ApiTags('Категорії відео')
@Controller('video-category')
export class VideoCategoryController {
  constructor(private readonly service: VideoCategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all video categories' })
  findAll(@Req() req: Request) {
    return this.service.findAll(req.lang)
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all video categories (wrapped as entities)' })
  async findAllEntities() {
    // This seems to be used for admin or somewhere where translations might not be needed or defaults are OK?
    // But since findAll now requires lang, we should provide one.
    // If we don't have request here, let's inject it or use default.
    // However, looking at the signature below, I should inject Request there too.
    return { entities: await this.service.findAll(LANG.UA) }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get video category by id' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.service.findOne(id, req.lang)
  }

  @Post()
  @ApiOperation({ summary: 'Create video category' })
  @ApiResponse({ status: 201, description: 'CREATED' })
  create(@Body() dto: CreateVideoCategoryDto) {
    return this.service.create(dto)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update video category' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVideoCategoryDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete video category' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id)
  }
}
