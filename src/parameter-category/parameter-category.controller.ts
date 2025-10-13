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
  Headers,
  Req,
  UseGuards
} from '@nestjs/common'
import { ParameterCategoryService } from './parameter-category.service'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { ParameterCategoryCreateDto } from '../parameter-category/dto/parameter-category-create.dto'
import { ParameterCategoryUpdateDto } from '../parameter-category/dto/parameter-category-udapte.dto'
import { ParameterCategoryCreateTranslateDto } from './dto/parameter-category-create-translate.dto'
import { ParameterCategoryUpdateTranslateDto } from './dto/parameter-category-update-translate.dto'
import { Request } from 'express'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ParameterCreateTranslateDto } from 'src/parameter/dto/parameter-create-translate.dto'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@ApiTags('Категорії параметрів')
@Controller('parameter-category')
export class ParameterCategoryController {
  constructor(private parameterCategoryService: ParameterCategoryService) {}

  @Get('all')
  @ApiOperation({ summary: 'Отримати всі категорії параметрів' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано всі сутності'
  })
  findAllList(@Req() req: Request) {
    return this.parameterCategoryService.findAllList(req.lang)
  }

  @Get()
  @ApiOperation({ summary: 'Отримати частину категорій параметрів' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей'
  })
  find(@Query() { take, skip }: TakeAndSkipDto, @Req() req: Request) {
    return this.parameterCategoryService.findAll(take, skip, req.lang)
  }

  @Get('search')
  @ApiOperation({ summary: 'Пошук категорій параметрів за заголовком' })
  @ApiResponse({ status: 200, description: 'SUCCESS - Знайдено категорії' })
  search(@Query('q') q: string, @Req() req: Request) {
    return this.parameterCategoryService.searchByTitle(q, req.lang)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати категорію параметрів' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано категорію'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  findOneCategory(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.parameterCategoryService.findOne(id, req.lang)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Створити категорію параметрів' })
  @ApiResponse({
    status: 201,
    description: 'CREATED - Сутність успішно створено'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Cутність не створено'
  })
  createCategory(@Body() dto: ParameterCategoryCreateDto) {
    return this.parameterCategoryService.create(dto)
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Оновити категорію параметрів' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутніть успішно оновлено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ParameterCategoryUpdateDto
  ) {
    return this.parameterCategoryService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Видалити категорію параметрів' })
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
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.parameterCategoryService.delete(id)
  }

  @Post('/translates')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Cтоврити переклади для категорії параметрів' })
  @ApiResponse({
    status: 201,
    description: 'CREATED - Сутність успішно створено'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Cутність не створено'
  })
  @ApiBody({
    description: 'Масив перекладів',
    type: ParameterCreateTranslateDto,
    isArray: true,
    required: true
  })
  createTranslates(@Body() dto: ParameterCategoryCreateTranslateDto[]) {
    return this.parameterCategoryService.createTranslates(dto)
  }

  @Put(':id/translates')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Оновити переклади для категорії параметрів' })
  @ApiResponse({
    status: 200,
    description: 'CREATED - Сутність успішно оновлено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  @ApiBody({
    description: 'Масив перекладів',
    type: ParameterCategoryUpdateTranslateDto,
    isArray: true,
    required: true
  })
  updateTranslates(@Body() dto: ParameterCategoryUpdateTranslateDto[]) {
    return this.parameterCategoryService.updateTranslates(dto)
  }

  @Delete(':id/translate')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Видалити переклад для категорії параметрів' })
  @ApiResponse({
    status: 200,
    description: 'CREATED - Сутність успішно видалено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  deleteTranslate(@Param('id', ParseIntPipe) id: number) {
    return this.parameterCategoryService.deleteTranslate(id)
  }
}
