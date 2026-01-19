import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'

import { CreatePageConstructorCategoryDto } from './dto/create-page-constructor-category.dto'
import { UpdatePageConstructorCategoryDto } from './dto/update-page-constructor-category.dto'
import { PageConstructorCategory } from './entities/page-constructor-category.entity'
import { PageConstructorCategoryService } from './page-constructor-category.service'
import { PageType } from '../page-constructor/entities/page-constructor.entity'

@ApiTags('Категорії конструктора сторінок')
@Controller('page-constructor-category')
export class PageConstructorCategoryController {
  constructor(private readonly categoryService: PageConstructorCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Створити нову категорію' })
  @ApiResponse({
    status: 201,
    description: 'Категорію успішно створено',
    type: PageConstructorCategory,
  })
  create(@Body() createDto: CreatePageConstructorCategoryDto) {
    return this.categoryService.create(createDto)
  }

  @Get()
  @ApiOperation({ summary: 'Отримати список категорій' })
  @ApiQuery({
    name: 'type',
    enum: PageType,
    required: false,
    description: 'Фільтр за типом (for-parent або for-teachers)',
  })
  @ApiResponse({
    status: 200,
    description: 'Список категорій',
    type: [PageConstructorCategory],
  })
  findAll(@Query('type') type?: PageType) {
    return this.categoryService.findAll(type)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати категорію за ID' })
  @ApiResponse({
    status: 200,
    description: 'Дані категорії',
    type: PageConstructorCategory,
  })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити категорію' })
  @ApiResponse({
    status: 200,
    description: 'Категорію успішно оновлено',
    type: PageConstructorCategory,
  })
  update(@Param('id') id: string, @Body() updateDto: UpdatePageConstructorCategoryDto) {
    return this.categoryService.update(+id, updateDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити категорію' })
  @ApiResponse({ status: 200, description: 'Категорію успішно видалено' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id)
  }
}
