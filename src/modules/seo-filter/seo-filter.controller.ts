import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

import { Request } from 'express'
import { LANG } from 'src/common/enums/translation.enum'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

import { SeoFilterCreateTranslateDto } from './dto/seo-filter-create-translate.dto'
import { SeoFilterCreateDto } from './dto/seo-filter-create.dto'
import { SeoFilterUpdateTranslateDto } from './dto/seo-filter-update-translate.dto'
import { SeoFilterUpdateDto } from './dto/seo-filter-update.dto'
import { SeoFilterService } from './seo-filter.service'

@ApiTags('SEO-фільтри')
@Controller('seo-filter')
export class SeoFilterController {
  constructor(private readonly seoFilterService: SeoFilterService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати seo-фільтри' })
  async findAll(@Req() req: Request) {
    return this.seoFilterService.find(req.lang)
  }

  @Get('all')
  @ApiOperation({ summary: 'Отримати всі seo-фільтри' })
  async findAllEntities() {
    // Default to UA or should we inject request?
    // Assuming admin usage which might default to UA, but better to be consistent if possible.
    // However, existing signature implies no params. Let's leave it as is or default to UA.
    // The previous code had no args, implying default UA. I will leave it as is for now unless requested.
    // Actually, let's keep it safe.
    const res = await this.seoFilterService.find(LANG.UA)
    return { entities: res.entities }
  }

  @Get('by-url/:url')
  @ApiOperation({ summary: 'Отримати seo-фільтр по url' })
  async findByUrl(@Param('url') url: string, @Req() req: Request) {
    return this.seoFilterService.findOneByUrl(url, req.lang)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати seo-фільтр' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.seoFilterService.findOne(id, req.lang)
  }

  @Get('by-category/:id/seo-filter')
  @ApiOperation({ summary: 'Отримати seo-фільтри за категорією' })
  async findByCategory(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.seoFilterService.findByCategory(id, req.lang)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Створити seo-фільтр' })
  async create(@Body() dto: SeoFilterCreateDto) {
    return this.seoFilterService.create(dto)
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Оновити seo-фільтр' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: SeoFilterUpdateDto) {
    return this.seoFilterService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Видалити seo-фільтр' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.seoFilterService.delete(id)
  }

  @Post('/translates')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутності успішно створено',
  })
  @ApiOperation({ summary: 'Створити переклади seo-фільтра' })
  createTranslates(@Body() dto: SeoFilterCreateTranslateDto[]) {
    return this.seoFilterService.createTranslates(dto)
  }

  @Put(':id/translates')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутності успішно оновлено',
  })
  @ApiOperation({ summary: 'Оновити переклади seo-фільтра' })
  updateTranslates(@Body() dto: SeoFilterUpdateTranslateDto[]) {
    return this.seoFilterService.updateTranslates(dto)
  }

  @Delete(':id/translate')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено',
  })
  @ApiOperation({ summary: 'Видалити переклад seo-фільтра' })
  deleteTranslate(@Param('id', ParseIntPipe) id: number) {
    return this.seoFilterService.deleteTranslate(id)
  }
}
