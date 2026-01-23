import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Patch, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBody, ApiQuery } from '@nestjs/swagger'

import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

import { MenuCreateDto } from './dto/menu-create.dto'
import { MenuUpdateDto } from './dto/menu-update.dto'
import { MenuType } from './entities/menu.entity'
import { MenuService } from './menu.service'

@ApiTags('Меню')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати меню' })
  @ApiQuery({ name: 'type', enum: MenuType, required: false })
  async findAll(@Query('type') type?: MenuType) {
    return this.menuService.find(undefined, undefined, type)
  }

  @Get('all')
  @ApiOperation({ summary: 'Отримати всі записи меню' })
  @ApiQuery({ name: 'type', enum: MenuType, required: false })
  async findAllEntities(@Query('type') type?: MenuType) {
    return this.menuService.findAllEntities(type)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати запис меню' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(id)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Створити запис меню' })
  async create(@Body() dto: MenuCreateDto) {
    return this.menuService.create(dto)
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Оновити запис меню' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: MenuUpdateDto) {
    return this.menuService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Видалити запис меню' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.delete(id)
  }

  @Patch('order')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Оновити порядок записів меню' })
  @ApiBody({
    description: 'Array of { id, order_in_list }',
    type: Object,
    isArray: true,
  })
  async reorder(@Body() orders: { id: number; order_in_list: number }[]) {
    return this.menuService.reorder(orders)
  }
}
