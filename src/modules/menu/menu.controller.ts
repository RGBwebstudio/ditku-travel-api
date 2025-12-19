import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Patch
} from '@nestjs/common'
import { MenuService } from './menu.service'
import { MenuCreateDto } from './dto/menu-create.dto'
import { MenuUpdateDto } from './dto/menu-update.dto'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger'

@ApiTags('Меню')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати меню' })
  async findAll() {
    return this.menuService.find()
  }

  @Get('all')
  @ApiOperation({ summary: 'Отримати всі записи меню' })
  async findAllEntities() {
    return this.menuService.findAllEntities()
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MenuUpdateDto
  ) {
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
    isArray: true
  })
  async reorder(@Body() orders: { id: number; order_in_list: number }[]) {
    return this.menuService.reorder(orders)
  }
}
