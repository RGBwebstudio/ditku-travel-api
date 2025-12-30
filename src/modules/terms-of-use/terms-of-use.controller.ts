import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Req, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { Request } from 'express'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

import { CreateTermsOfUseDto } from './dto/create-terms-of-use.dto'
import { UpdateTermsOfUseDto } from './dto/update-terms-of-use.dto'
import { TermsOfUseService } from './terms-of-use.service'

@ApiTags('Terms of use')
@Controller('terms-of-use')
export class TermsOfUseController {
  constructor(protected readonly service: TermsOfUseService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей',
  })
  @ApiOperation({ summary: 'Отримати весь контент terms-of-use' })
  findAll(@Query() { take, skip }: TakeAndSkipDto) {
    return this.service.findAll(take, skip)
  }

  @Get(':lang')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно отримано',
  })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Сутність не знайдено' })
  @ApiOperation({ summary: 'Отримати контент terms-of-use' })
  findOne(@Req() req: Request) {
    return this.service.findOne(req.lang)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутність успішно створено',
  })
  @ApiOperation({ summary: 'Створення контенту terms-of-use' })
  create(@Body() dto: CreateTermsOfUseDto) {
    return this.service.create(dto)
  }

  @Patch()
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Оновити контент terms-of-use' })
  update(@Body() dto: UpdateTermsOfUseDto) {
    return this.service.update(dto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Видалити контент terms-of-use' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id)
  }
}
