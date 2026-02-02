import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  Body,
  Query,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { Request } from 'express'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

import { FormatGroupCreateDto } from './dto/format-group-create.dto'
import { FormatGroupUpdateDto } from './dto/format-group-update.dto'
import { FormatGroupService } from './format-group.service'

@ApiTags('Формат груп')
@Controller('format-group')
export class FormatGroupController {
  constructor(private readonly service: FormatGroupService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати частину формат груп' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей',
  })
  find(@Query() { take, skip }: TakeAndSkipDto, @Req() req: Request) {
    return this.service.find(take, skip, req.lang)
  }

  @Get('search')
  @ApiOperation({ summary: 'Пошук формат груп за заголовком' })
  @ApiResponse({ status: 200, description: 'SUCCESS - Знайдено формат групи' })
  search(@Query('q') q: string, @Req() req: Request) {
    return this.service.searchByTitle(q, req.lang)
  }

  @Get('all')
  @ApiOperation({ summary: 'Отримати всі формат групи' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано всі сутності',
  })
  findAll(@Req() req: Request) {
    return this.service.findAll(req.lang)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати формат групу' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано сутність',
  })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Cутність не знайдено' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Створити формат групу' })
  @ApiResponse({
    status: 201,
    description: 'CREATED - Сутність успішно створено',
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Cутність не створено',
  })
  create(@Body() dto: FormatGroupCreateDto) {
    return this.service.create(dto)
  }

  @Patch(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Оновити формат групу' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено',
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_UPDATED - Cутність не оновлено',
  })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Cутність не знайдено' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: FormatGroupUpdateDto) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Видалити формат групу' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено',
  })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Cутність не знайдено' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id)
  }
}
