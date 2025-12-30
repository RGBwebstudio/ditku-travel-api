import { Controller, Get, Post, Body, Param, ParseIntPipe, Put, Delete } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

import { CreateVideoDto } from './dto/create-video.dto'
import { UpdateVideoDto } from './dto/update-video.dto'
import { VideoService } from './video.service'

@ApiTags('Відео')
@Controller('video')
export class VideoController {
  constructor(private readonly service: VideoService) {}

  @Get()
  @ApiOperation({ summary: 'Get all videos' })
  findAll() {
    return this.service.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get video by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Post()
  @ApiOperation({ summary: 'Create video' })
  @ApiResponse({ status: 201, description: 'CREATED' })
  create(@Body() dto: CreateVideoDto) {
    return this.service.create(dto)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update video' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVideoDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete video' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id)
  }
}
