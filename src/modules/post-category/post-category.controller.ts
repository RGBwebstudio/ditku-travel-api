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
  UseGuards,
  Req
} from '@nestjs/common'
import { PostCategoryService } from './post-category.service'
import { PostCategoryCreateDto } from './dto/post-category-create.dto'
import { PostCategoryUpdateDto } from './dto/post-category-update.dto'
import { PostCategoryCreateTranslateDto } from './dto/post-category-create-translate.dto'
import { PostCategoryUpdateTranslateDto } from './dto/post-category-update-translate.dto'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam
} from '@nestjs/swagger'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'
import { Request } from 'express'

@ApiTags('Категорії постів')
@Controller('post-category')
export class PostCategoryController {
  constructor(private readonly postCategoryService: PostCategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список категорій постів' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Список категорій отримано'
  })
  findAll(
    @Query('take') take: string,
    @Query('skip') skip: string,
    @Req() req: Request
  ) {
    const takeNumber = take ? Number(take) : undefined
    const skipNumber = skip ? Number(skip) : undefined
    return this.postCategoryService.findAll(takeNumber, skipNumber, req.lang)
  }

  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано всі сутності'
  })
  @ApiOperation({ summary: 'Отримати всі категорії постів' })
  findAllList(@Req() req: Request) {
    return this.postCategoryService.findAllList(req.lang)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати категорію посту за ID' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Категорія успішно отримана'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Категорія не знайдена'
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'ID категорії посту'
  })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.postCategoryService.findOne(id, req.lang)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Створити категорію посту' })
  @ApiResponse({ status: 201, description: 'CREATED - Категорія створена' })
  @ApiResponse({ status: 400, description: 'NOT_CREATED - Некоректні дані' })
  create(@Body() createDto: PostCategoryCreateDto) {
    return this.postCategoryService.create(createDto)
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Оновити категорію посту' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Категорія успішно оновлена'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Категорія не знайдена'
  })
  @ApiResponse({ status: 400, description: 'NOT_UPDATED - Некоректні дані' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: PostCategoryUpdateDto
  ) {
    return this.postCategoryService.update(id, updateDto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Видалити категорію посту' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Категорія успішно видалена'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Категорія не знайдена'
  })
  @ApiResponse({
    status: 400,
    description: 'HAS_CHILDREN - Не вдалося видалити'
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.postCategoryService.delete(id)
  }

  @Post('/translates')
  @UseGuards(AuthAdminGuard)
  @ApiBody({ type: PostCategoryCreateTranslateDto, isArray: true })
  @ApiOperation({ summary: 'Створити переклади для категорій постів' })
  @ApiResponse({ status: 201, description: 'CREATED - Переклади створено' })
  createTranslates(
    @Body() createTranslatesDto: PostCategoryCreateTranslateDto[]
  ) {
    return this.postCategoryService.createTranslates(createTranslatesDto)
  }

  @Put(':id/translates')
  @UseGuards(AuthAdminGuard)
  @ApiBody({ type: PostCategoryUpdateTranslateDto, isArray: true })
  @ApiOperation({ summary: 'Оновити переклади категорій постів' })
  @ApiResponse({ status: 200, description: 'SUCCESS - Переклади оновлено' })
  updateTranslates(
    @Body() updateTranslatesDto: PostCategoryUpdateTranslateDto[]
  ) {
    return this.postCategoryService.updateTranslates(updateTranslatesDto)
  }

  @Delete(':id/translate')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Видалити переклад категорії посту' })
  @ApiResponse({ status: 200, description: 'SUCCESS - Переклад видалено' })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Переклад не знайдено' })
  deleteTranslate(@Param('id', ParseIntPipe) id: number) {
    return this.postCategoryService.deleteTranslate(id)
  }
}
