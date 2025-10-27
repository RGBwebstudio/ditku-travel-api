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
  UseInterceptors,
  Req,
  UploadedFiles,
  UseGuards
} from '@nestjs/common'
import { CategoryCreateDto } from './dto/category-create.dto'
import { CategoryUpdateDto } from './dto/category-update.dto'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { CategoryService } from './category.service'
import { CategoryCreateTranslateDto } from './dto/category-create-translate.dto'
import { CategoryUpdateTranslateDto } from './dto/category-update-translate.dto'
import { CategoryUploadImageDto } from './dto/category-upload-image.dto'
import { FilesInterceptor } from '@nestjs/platform-express'
import { FilesSizeValidationPipe } from 'src/common/pipes/files-upload.pipe'
import { Request } from 'express'
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'
import { IdOrUrlValidationPipe } from 'src/common/pipes/id-or-url.pipe'
import { FineOneWhereType } from 'src/common/types/category.types'

@ApiTags('Категорії')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано всі сутності'
  })
  @ApiOperation({ summary: 'Отримати всі категорії' })
  findAllList(@Req() req: Request) {
    return this.categoryService.findAllList(req.lang)
  }

  @Get('search')
  @ApiOperation({ summary: 'Пошук категорій за заголовком' })
  @ApiResponse({ status: 200, description: 'SUCCESS - Знайдено категорії' })
  search(@Query('q') q: string, @Req() req: Request) {
    return this.categoryService.searchByTitle(q, req.lang)
  }

  @Get('showroom')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано чистину сутностей'
  })
  @ApiOperation({
    summary: 'Отримати список категорій з товарами для головної сторінки'
  })
  findInShowRoom(@Req() req: Request) {
    return this.categoryService.findInShowRoom(req.lang)
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано чистину сутностей'
  })
  @ApiOperation({ summary: 'Отримати частину категорій' })
  find(@Query() { take, skip }: TakeAndSkipDto, @Req() req: Request) {
    return this.categoryService.findAll(take, skip, req.lang)
  }

  @Get(':value')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно отримано'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  @ApiParam({
    name: 'value',
    required: true,
    type: String,
    description: 'Id або url категорії (наприклад: 1 або "yabluka")',
    example: '1'
  })
  @ApiOperation({ summary: 'Отримати категорію' })
  findOne(
    @Param('value', IdOrUrlValidationPipe) value: FineOneWhereType,
    @Req() req: Request
  ) {
    return this.categoryService.findOne(value, req.lang)
  }

  @Get(':id/additional-filters')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Отримано додаткові фільтри для категорії'
  })
  @ApiOperation({
    summary:
      'Отримати додаткові фільтри (start/end точки roadmap) для товарів у категорії'
  })
  findAdditionalFilters(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getAdditionalFilters(id)
  }

  @Get('/tree/all')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутності успішно отримано'
  })
  @ApiOperation({
    summary: 'Отримати всі кореневі категорії з дітьми до depth'
  })
  findAllSubtree(@Query('depth') depth: string, @Req() req: Request) {
    console.log('fire')
    const parsedDepth = depth !== undefined ? parseInt(depth, 10) : 1
    return this.categoryService.findAllSubtree(
      isNaN(parsedDepth) ? 1 : parsedDepth,
      req.lang
    )
  }

  @Get(':value/subtree')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність та її піддерево успішно отримано'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  @ApiParam({
    name: 'value',
    required: true,
    type: String,
    description: 'Id або url категорії (наприклад: 1 або "yabluka")',
    example: '1'
  })
  @ApiOperation({
    summary: 'Отримати піддерево категорії до заданої глибини'
  })
  findSubtree(
    @Param('value', IdOrUrlValidationPipe) value: FineOneWhereType,
    @Query('depth') depth: string
  ) {
    const parsedDepth = depth !== undefined ? parseInt(depth, 10) : 1
    return this.categoryService.findSubtree(
      value,
      isNaN(parsedDepth) ? 1 : parsedDepth
    )
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'CREATED - Сутність успішно створено'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Cутність не знайдено'
  })
  @ApiOperation({ summary: 'Створити категорію' })
  create(@Body() dto: CategoryCreateDto) {
    return this.categoryService.create(dto)
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Оновити категорію' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  @ApiResponse({
    status: 400,
    description: 'IS_EXIST - Cутність з таким значенням title вже існує'
  })
  update(
    @Body() dto: CategoryUpdateDto,
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request
  ) {
    return this.categoryService.update(id, req.lang, dto)
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
  @ApiOperation({ summary: 'Видалити категорію' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.delete(id)
  }

  @Post('/translates')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутності успішно створено'
  })
  @ApiOperation({ summary: 'Отримати всі переклади категорії' })
  @ApiBody({
    description: 'Масив перекладів',
    type: CategoryCreateTranslateDto,
    isArray: true,
    required: true
  })
  createTranslates(@Body() dto: CategoryCreateTranslateDto[]) {
    return this.categoryService.createTranslates(dto)
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
    description: 'Масив перекладів',
    type: CategoryUpdateTranslateDto,
    isArray: true,
    required: true
  })
  @ApiOperation({ summary: 'Оновити переклади категорії' })
  updateTranslates(@Body() dto: CategoryUpdateTranslateDto[]) {
    return this.categoryService.updateTranslates(dto)
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
  @ApiOperation({ summary: 'Оновити переклади категорії' })
  deleteTranslate(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteTranslate(id)
  }

  @Post('upload/:id')
  @UseGuards(AuthAdminGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @ApiResponse({
    status: 201,
    description:
      "SUCCESS - Сутність успішно завантажено і прикріплено до об'єкту"
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Сутність не створено'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_UPLOADED - Сутність не завантажено'
  })
  @ApiOperation({ summary: 'Завантажити зображення категорії' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Завантаження фото категорії',
    type: CategoryUploadImageDto
  })
  @ApiBody({
    description: 'Завантаження фото категорії',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary'
          }
        }
      }
    }
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'Id категорії'
  })
  uploadFile(
    @UploadedFiles(new FilesSizeValidationPipe()) files: Express.Multer.File[],
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.categoryService.uploadImages(files, id)
  }

  @Delete('/image/:id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Cутність успішно видалено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  @ApiOperation({ summary: 'Видалити зображення категорії' })
  deleteEntityImage(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteImage(id)
  }
}
