import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { ParameterService } from './parameter.service'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { ParameterDto } from './dto/parameter.dto'
import { ParameterUpdateTranslateDto } from './dto/parameter-update-translate.dto'
import { ParameterCreateTranslateDto } from './dto/parameter-create-translate.dto'
import { Request } from 'express'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

@ApiTags('Параметри')
@Controller('parameter')
export class ParameterController {
  constructor(private parameterService: ParameterService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати всі параметри' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано всі сутності'
  })
  findAll(
    @Query() { take: takeNumber, skip: skipNumber }: TakeAndSkipDto,
    @Req() req: Request
  ) {
    return this.parameterService.findAll(takeNumber, skipNumber, req.lang)
  }

  @Get('search')
  @ApiOperation({ summary: 'Пошук параметрів за заголовком' })
  @ApiResponse({ status: 200, description: 'SUCCESS - Знайдено параметри' })
  search(@Query('q') query: string, @Req() req: Request) {
    return this.parameterService.searchByTitle(query, req.lang)
  }

  @Get('all')
  @ApiOperation({ summary: 'Отримати всі параметри без пагінації' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано всі параметри'
  })
  getAllList(@Req() req: Request) {
    return this.parameterService.getAllList(req.lang)
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно отримано'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено'
  })
  @ApiOperation({ summary: 'Отримати параметр' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.parameterService.findOne(id, req.lang)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'CREATED - Сутність успішно створено'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Cутність не створено'
  })
  @ApiOperation({ summary: 'Створити параметр' })
  create(@Body() dto: ParameterDto) {
    return this.parameterService.create(dto)
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  @ApiOperation({ summary: 'Оновити параметр' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: ParameterDto) {
    return this.parameterService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Видалити параметр' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.parameterService.delete(id)
  }

  @Post('/translates')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Cтворити переклади параметру' })
  @ApiBody({
    description: 'Масив перекладів',
    type: ParameterCreateTranslateDto,
    isArray: true,
    required: true
  })
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутність успішно створено'
  })
  createTranslates(@Body() dto: ParameterCreateTranslateDto[]) {
    return this.parameterService.createTranslates(dto)
  }

  @Put(':id/translates')
  @UseGuards(AuthAdminGuard)
  @ApiBody({
    description: 'Масив перекладів',
    type: ParameterUpdateTranslateDto,
    isArray: true,
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутності успішно оновлено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  @ApiOperation({ summary: 'Оновити переклади параметру' })
  updateTranslates(@Body() dto: ParameterUpdateTranslateDto[]) {
    return this.parameterService.updateTranslates(dto)
  }

  @Delete(':id/translate')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  @ApiOperation({ summary: 'Видалити переклад параметру' })
  deleteTranslate(@Param('id', ParseIntPipe) id: number) {
    return this.parameterService.deleteTranslate(id)
  }

  @Get('by-category/:url')
  @ApiOperation({
    summary:
      'Отримати категорії параметрів та їх параметри за url категорії товарів'
  })
  getByCategoryUrl(@Param('url') categoryUrl: string, @Req() req: Request) {
    return this.parameterService.getByProductCategoryUrl(categoryUrl, req.lang)
  }
}
