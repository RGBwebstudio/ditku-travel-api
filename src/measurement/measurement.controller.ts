import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
  Delete,
  Put,
  Headers,
  Req,
  UseGuards
} from '@nestjs/common'
import { MeasurementCreateDto } from './dto/measurement-create.dto'
import { MeasurementUpdateDto } from './dto/measurement-update.dto'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { MeasurementService } from './measurement.service'
import { MeasurementCreateTranslateDto } from './dto/measurement-create-translate.dto'
import { MeasurementUpdateTranslateDto } from './dto/measurement-update-translate.dto'
import { Request } from 'express'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@ApiTags('Одиниці виміру')
@Controller('measurement')
export class MeasurmenetController {
  constructor(private measurementService: MeasurementService) {}

  @Get('all')
  @ApiOperation({ summary: 'Отримати всі одиниці виміру' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано всі сутності'
  })
  findAllList(@Req() req: Request) {
    return this.measurementService.findAllList(req.lang)
  }

  @Get('search')
  @ApiOperation({ summary: 'Пошук одиниць виміру за заголовком' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Знайдено одиниці виміру'
  })
  search(@Query('q') q: string, @Req() req: Request) {
    return this.measurementService.searchByTitle(q, req.lang)
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей'
  })
  @ApiOperation({ summary: 'Отримати частину одиниць виміру' })
  find(@Query() { take, skip }: TakeAndSkipDto, @Req() req: Request) {
    return this.measurementService.findAll(take, skip, req.lang)
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано сутність'
  })
  @ApiOperation({ summary: 'Отримати одиницю виміру' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.measurementService.findOne(id, req.lang)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутність успішно створено'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Cутність не створено'
  })
  @ApiOperation({ summary: 'Cтворити одиницю виміру' })
  create(@Body() dto: MeasurementCreateDto) {
    return this.measurementService.create(dto)
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
  @ApiOperation({ summary: 'Оновити одиницю виміру' })
  update(
    @Body() dto: MeasurementUpdateDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.measurementService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  @ApiResponse({
    status: 400,
    description: 'HAS_CHILDS - Сутність має нащадки, не може бути видалена'
  })
  @ApiOperation({ summary: 'Видалити одиницю виміру' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.measurementService.delete(id)
  }

  @Post('/translates')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутності успішно створено'
  })
  @ApiBody({
    description: 'Список перекладів',
    type: MeasurementCreateTranslateDto,
    isArray: true,
    required: true
  })
  @ApiOperation({ summary: 'Cтворити переклади для одиниці виміру' })
  createTranslates(@Body() dto: MeasurementCreateTranslateDto[]) {
    return this.measurementService.createTranslates(dto)
  }

  @Put(':id/translates')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутності успішно оновлено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  @ApiBody({
    description: 'Список перекладів',
    type: MeasurementUpdateTranslateDto,
    isArray: true,
    required: true
  })
  @ApiOperation({ summary: 'Оновити переклади для одиниці виміру' })
  updateTranslates(@Body() dto: MeasurementUpdateTranslateDto[]) {
    return this.measurementService.updateTranslates(dto)
  }

  @Delete(':id/translate')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутності успішно видалено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  @ApiOperation({ summary: 'Видалити переклади для одиниці виміру' })
  deleteTranslate(@Param('id', ParseIntPipe) id: number) {
    return this.measurementService.deleteTranslate(id)
  }
}
