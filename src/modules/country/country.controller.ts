import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Query,
  ParseIntPipe,
  Req,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { Request } from 'express'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

import { CountryService } from './country.service'
import { CountryCreateTranslateDto } from './dto/country-create-translate.dto'
import { CountryUpdateTranslateDto } from './dto/country-update-translate.dto'
import { CreateCountryDto } from './dto/create-country.dto'
import { UpdateCountryDto } from './dto/update-country.dto'

@ApiTags('Країна')
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей',
  })
  @ApiOperation({ summary: 'Отримати всі країни' })
  findAll(@Query() { take, skip }: TakeAndSkipDto, @Req() req: Request) {
    return this.countryService.findAll(take, skip, req.lang)
  }

  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано всі сутності',
  })
  @ApiOperation({ summary: 'Отримати список всіх країн' })
  getAllList(@Req() req: Request) {
    return this.countryService.getAllList(req.lang)
  }

  @Get('search')
  @ApiOperation({ summary: 'Пошук країн за заголовком' })
  @ApiResponse({ status: 200, description: 'SUCCESS - Знайдено країни' })
  search(@Query('q') q: string, @Req() req: Request) {
    return this.countryService.searchByTitle(q, req.lang)
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
  @ApiOperation({ summary: 'Отримати країну' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.countryService.findOne(id, req.lang)
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
  @ApiOperation({ summary: 'Створення країни' })
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countryService.create(createCountryDto)
  }

  @Patch(':id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено',
  })
  @ApiOperation({ summary: 'Оновити країну' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countryService.update(id, updateCountryDto)
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
  @ApiOperation({ summary: 'Видалити країну' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.countryService.delete(id)
  }

  @Post('/translates')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутності успішно створено',
  })
  @ApiOperation({ summary: 'Створити переклади для країни' })
  @ApiBody({
    description: 'Масив перекладів',
    type: CountryCreateTranslateDto,
    isArray: true,
    required: true,
  })
  createTranslates(@Body() dto: CountryCreateTranslateDto[]) {
    return this.countryService.createTranslates(dto)
  }

  @Put(':id/translates')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутності успішно оновлено',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено',
  })
  @ApiOperation({ summary: 'Оновити переклади країни' })
  @ApiBody({
    description: 'Масив перекладів',
    type: CountryUpdateTranslateDto,
    isArray: true,
    required: true,
  })
  updateTranslates(@Body() dto: CountryUpdateTranslateDto[]) {
    return this.countryService.updateTranslates(dto)
  }

  @Delete(':id/translate')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено',
  })
  @ApiOperation({ summary: 'Видалити переклад країни' })
  deleteTranslate(@Param('id', ParseIntPipe) id: number) {
    return this.countryService.deleteTranslate(id)
  }
}
