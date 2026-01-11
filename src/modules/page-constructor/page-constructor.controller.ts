import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Req, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { Request } from 'express'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { LANG } from 'src/common/enums/translation.enum'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

import { CreatePageConstructorDto } from './dto/create-page-constructor.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { UpdatePageConstructorDto } from './dto/update-page-constructor.dto'
import { PageType } from './entities/page-constructor.entity'
import { PageConstructorService } from './page-constructor.service'

@ApiTags('Конструктор сторінок')
@Controller('page-constructor')
export class PageConstructorController {
  constructor(private readonly pageConstructorService: PageConstructorService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей',
  })
  @ApiOperation({ summary: 'Отримати весь конструктор сторінок' })
  findAll(@Query() { take, skip }: TakeAndSkipDto) {
    return this.pageConstructorService.findAll(take, skip)
  }

  @Get('types')
  @ApiOperation({ summary: 'Отримати варіанти page_type' })
  getTypes() {
    return Object.values(PageType)
  }

  @Get(':lang')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно отримано',
  })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Сутність не знайдено' })
  @ApiOperation({ summary: 'Отримати конструктор сторінки за мовою' })
  findOne(@Req() req: Request, @Query('page_type') page_type?: PageType) {
    return this.pageConstructorService.findOne(req.lang, page_type)
  }

  @Get('by-slug/:slug')
  @ApiOperation({ summary: 'Отримати сторінку за URL (slug)' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно отримано',
  })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Сутність не знайдено' })
  findByUrl(@Param('slug') slug: string, @Query('lang') lang: LANG) {
    return this.pageConstructorService.findByUrl(slug, lang)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутність успішно створено',
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Cутність не створено',
  })
  @ApiOperation({ summary: 'Створення запису конструктора сторінки' })
  create(@Body() createDto: CreatePageConstructorDto) {
    return this.pageConstructorService.create(createDto)
  }

  @Patch()
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено',
  })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Сутність не знайдено' })
  @ApiOperation({ summary: 'Оновити запис конструктора сторінки' })
  update(@Body() updateDto: UpdatePageConstructorDto) {
    return this.pageConstructorService.update(updateDto)
  }

  @Patch('order')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Порядок блоків оновлено',
  })
  @ApiOperation({ summary: 'Оновити порядок блоків конструктора сторінки' })
  updateOrder(@Body() dto: UpdateOrderDto) {
    return this.pageConstructorService.updateOrder(dto.items)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено',
  })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Сутість не знайдено' })
  @ApiResponse({
    status: 400,
    description: 'HAS_CHILDS - Сутність має нащадки, не може бути видалена',
  })
  @ApiOperation({ summary: 'Видалити запис конструктора сторінки' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.pageConstructorService.delete(id)
  }
}
