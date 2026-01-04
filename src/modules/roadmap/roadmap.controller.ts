import { Controller, Get, Post, Param, Query, Body, ParseIntPipe, Delete, Put, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

import { CreateRoadmapDto } from './dto/create-roadmap.dto'
import { RoadmapCreateTranslateDto } from './dto/roadmap-create-translate.dto'
import { RoadmapUpdateTranslateDto } from './dto/roadmap-update-translate.dto'
import { UpdateRoadmapItemDto } from './dto/update-roadmap-item.dto'
import { UpdateRoadmapDto } from './dto/update-roadmap.dto'
import { RoadmapService } from './roadmap.service'

@ApiTags('Дорожня карта туру')
@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}
  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей',
  })
  @ApiOperation({ summary: 'Отримати частину записів roadmap' })
  find(@Query('take') take: number = 20, @Query('skip') skip: number = 0) {
    return this.roadmapService.findAll(Number(take), Number(skip))
  }
  @Get(':id')
  @ApiOperation({ summary: 'Отримати запис roadmap' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roadmapService.findOne(id)
  }

  @Post()
  @ApiOperation({ summary: 'Cтворити запис roadmap' })
  @ApiResponse({
    status: 201,
    description: 'CREATED - Сутність успішно створено',
  })
  create(@Body() dto: CreateRoadmapDto) {
    return this.roadmapService.create(dto)
  }

  @Post('create-from-array')
  @ApiOperation({ summary: 'Cтворити масив записів roadmap' })
  @ApiResponse({
    status: 201,
    description: 'CREATED - Масив сутностей успішно створено',
  })
  createFromArray(@Body() body: CreateRoadmapDto[]) {
    return this.roadmapService.createFromArray(body)
  }

  @Put('update/from-array')
  @ApiOperation({ summary: 'Оновити масив записів roadmap' })
  updateFromArray(@Body() dto: UpdateRoadmapItemDto[]) {
    return this.roadmapService.updateFromArray(dto)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити запис roadmap' })
  update(@Body() dto: UpdateRoadmapDto, @Param('id', ParseIntPipe) id: number) {
    return this.roadmapService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити запис roadmap' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.roadmapService.delete(id)
  }

  @Post('/translates')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутності успішно створено',
  })
  @ApiOperation({ summary: 'Створити переклади roadmap' })
  createTranslates(@Body() dto: RoadmapCreateTranslateDto[]) {
    return this.roadmapService.createTranslates(dto)
  }

  @Put(':id/translates')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутності успішно оновлено',
  })
  @ApiOperation({ summary: 'Оновити переклади roadmap' })
  updateTranslates(@Body() dto: RoadmapUpdateTranslateDto[]) {
    return this.roadmapService.updateTranslates(dto)
  }

  @Delete(':id/translate')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено',
  })
  @ApiOperation({ summary: 'Видалити переклад roadmap' })
  deleteTranslate(@Param('id', ParseIntPipe) id: number) {
    return this.roadmapService.deleteTranslate(id)
  }
}
