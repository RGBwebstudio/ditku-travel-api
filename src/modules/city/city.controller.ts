import { Controller, Get, Post, Param, Query, Body, ParseIntPipe, Delete, Put } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { CityService } from './city.service'
import { CityCreateTranslateDto } from './dto/city-create-translate.dto'
import { CityUpdateTranslateDto } from './dto/city-update-translate.dto'
import { CreateCityDto } from './dto/create-city.dto'
import { UpdateCityDto } from './dto/update-city.dto'

@ApiTags('Міста')
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}
  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей',
  })
  @ApiOperation({ summary: 'Отримати частину міст' })
  find(@Query('take') take: number = 20, @Query('skip') skip: number = 0, @Query('country_id') country_id?: string) {
    if (country_id !== undefined && country_id !== null && String(country_id).trim() !== '') {
      return this.cityService.findByCountry(Number(country_id))
    }

    return this.cityService.findAll(Number(take), Number(skip))
  }

  @Get('all')
  async getAllList(@Query('country_id') country_id?: string) {
    if (country_id !== undefined && country_id !== null && String(country_id).trim() !== '') {
      const entities = await this.cityService.findByCountry(Number(country_id))
      return { entities }
    }

    return this.cityService.getAllList()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати місто' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cityService.findOne(id)
  }

  @Post()
  @ApiOperation({ summary: 'Створити місто' })
  create(@Body() dto: CreateCityDto) {
    return this.cityService.create(dto)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити місто' })
  update(@Body() dto: UpdateCityDto, @Param('id', ParseIntPipe) id: number) {
    return this.cityService.update(id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити місто' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.cityService.delete(id)
  }

  @Post('/translates')
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутності успішно створено',
  })
  @ApiOperation({ summary: 'Створити переклади міста' })
  createTranslates(@Body() dto: CityCreateTranslateDto[]) {
    return this.cityService.createTranslates(dto)
  }

  @Put(':id/translates')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутності успішно оновлено',
  })
  @ApiOperation({ summary: 'Оновити переклади міста' })
  updateTranslates(@Body() dto: CityUpdateTranslateDto[]) {
    return this.cityService.updateTranslates(dto)
  }

  @Delete(':id/translate')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено',
  })
  @ApiOperation({ summary: 'Видалити переклад міста' })
  deleteTranslate(@Param('id', ParseIntPipe) id: number) {
    return this.cityService.deleteTranslate(id)
  }
}
