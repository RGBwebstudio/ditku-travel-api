import { Controller, Get, Post, Body, Param, Delete, Query, ParseIntPipe, Put, UseGuards, Req } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { Request } from 'express'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

import { CreateFaqDto } from './dto/create-faq.dto'
import { FaqCreateTranslateDto } from './dto/faq-create-translate.dto'
import { FaqUpdateTranslateDto } from './dto/faq-update-translate.dto'
import { UpdateFaqDto } from './dto/update-faq.dto'
import { FaqService } from './faq.service'

@ApiTags('Запитання та відповіді')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутності успішно отримано',
  })
  @ApiOperation({ summary: 'Отримати всі FAQ' })
  findAll(@Query() { take, skip }: TakeAndSkipDto, @Req() req: Request) {
    return this.faqService.findAll(take, skip, req.lang)
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно отримано',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено',
  })
  @ApiOperation({ summary: 'Отримати запис FAQ' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.faqService.findOne(id, req.lang)
  }

  @Post()
  @ApiOperation({ summary: 'Створити запис FAQ' })
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'CREATED - Сутність успішно створено',
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Cутність не cтворено',
  })
  create(@Body() dto: CreateFaqDto) {
    return this.faqService.create(dto)
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено',
  })
  @ApiOperation({ summary: 'Оновити запис FAQ' })
  @UseGuards(AuthAdminGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFaqDto) {
    return this.faqService.update(id, dto)
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено',
  })
  @ApiOperation({ summary: 'Видалити запис FAQ' })
  @UseGuards(AuthAdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.delete(id)
  }

  @Post('/translates')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутності успішно створено',
  })
  @ApiOperation({ summary: 'Отримати всі переклади FAQ' })
  @ApiBody({
    description: 'Масив перекладів',
    type: FaqCreateTranslateDto,
    isArray: true,
    required: true,
  })
  createTranslates(@Body() dto: FaqCreateTranslateDto[]) {
    return this.faqService.createTranslates(dto)
  }

  @Put(':id/translates')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутності успішно оновлено',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено',
  })
  @ApiBody({
    description: 'Масив перекладів',
    type: FaqUpdateTranslateDto,
    isArray: true,
    required: true,
  })
  @ApiOperation({ summary: 'Оновити переклади FAQ' })
  updateTranslates(@Body() dto: FaqUpdateTranslateDto[]) {
    return this.faqService.updateTranslates(dto)
  }

  @Delete(':id/translate')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено',
  })
  @ApiOperation({ summary: 'Оновити переклади FAQ' })
  deleteTranslate(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.deleteTranslate(id)
  }
}
