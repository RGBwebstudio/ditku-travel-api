import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Req, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { Request } from 'express'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

import { CreateMainPageDto } from './dto/create-main-page.dto'
import { UpdateMainPageDto } from './dto/update-main-page.dto'
import { MainPageService } from './main-page.service'

@ApiTags('Головна сторінка')
@Controller('main-page')
export class MainPageController {
  constructor(private readonly mainPageService: MainPageService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей',
  })
  @ApiOperation({ summary: 'Отримати весь контент головної сторінки' })
  findAll(@Query() { take, skip }: TakeAndSkipDto) {
    return this.mainPageService.findAll(take, skip)
  }

  @Get(':lang')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно отримано',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено',
  })
  @ApiOperation({ summary: 'Отримати контент головної сторінки' })
  findOne(@Req() req: Request) {
    return this.mainPageService.findOne(req.lang)
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
  @ApiOperation({ summary: 'Створення контенту головної сторінки' })
  create(@Body() createMainPageDto: CreateMainPageDto) {
    return this.mainPageService.create(createMainPageDto)
  }

  @Patch()
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено',
  })
  @ApiOperation({ summary: 'Оновити контент головної сторінки' })
  update(@Body() updateMainPageDto: UpdateMainPageDto) {
    return this.mainPageService.update(updateMainPageDto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено',
  })
  @ApiResponse({
    status: 400,
    description: 'HAS_CHILDS - Сутність має нащадки, не може бути видалена',
  })
  @ApiOperation({ summary: 'Видалити контент головної сторінки' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.mainPageService.delete(id)
  }
}
