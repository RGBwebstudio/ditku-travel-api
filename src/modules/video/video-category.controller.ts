import { Controller, Get, Post, Body, Param, ParseIntPipe, Put, Delete } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

import { CreateVideoCategoryDto } from './dto/create-video-category.dto'
import { UpdateVideoCategoryDto } from './dto/update-video-category.dto'
import { VideoCategoryService } from './video-category.service'

@ApiTags('Категорії відео')
@Controller('video-category')
export class VideoCategoryController {
  constructor(private readonly service: VideoCategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all video categories' })
  findAll() {
    return this.service.findAll()
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all video categories (wrapped as entities)' })
  async findAllEntities() {
    const items = await this.service.findAll()
    return { entities: items }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get video category by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
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
