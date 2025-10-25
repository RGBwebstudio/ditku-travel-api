import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
  Delete,
  Put
} from '@nestjs/common'
import { CreateCityDto } from './dto/create-city.dto'
import { UpdateCityDto } from './dto/update-city.dto'
import { CityService } from './city.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Міста')
@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}
  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей'
  })
  @ApiOperation({ summary: 'Отримати частину міст' })
  find(@Query('take') take: number = 20, @Query('skip') skip: number = 0) {
    return this.cityService.findAll(Number(take), Number(skip))
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
}
