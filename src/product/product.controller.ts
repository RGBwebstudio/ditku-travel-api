import {
  Controller,
  ParseIntPipe,
  Query,
  Param,
  Body,
  Get,
  Put,
  Post,
  Delete,
  Patch,
  Headers,
  Req,
  UseGuards,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { ProductService } from './product.service'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { ProductCreateDto } from './dto/product-create.dto'
import { ProductUpdateDto } from './dto/product-update.dto'
import { ProductParametersDto } from './dto/product-parameters.dto'
import { ProductFilterDto } from './dto/product-filter.dto'
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { ProductUpdateTranslateDto } from './dto/product-update-translate.dto'
import { ProductCreateTranslateDto } from './dto/product-create-translate.dto'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'
import { Product } from './entities/product.entity'
import { Request } from 'express'
import { FilesSizeValidationPipe } from 'src/common/pipes/files-upload.pipe'
import { ProductUploadImageDto } from './dto/product-upload-image.dto'
import { ProductDeleteImagesDto } from './dto/product-delete-images.dto'
import { FilesInterceptor } from '@nestjs/platform-express'

@ApiTags('Товари')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('search')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано cутність'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено'
  })
  @ApiOperation({
    summary: 'Пошук товарів (id, custom_id, title) по q, максимум 20)'
  })
  async search(@Query('q') q: string) {
    return await this.productService.searchShort(q)
  }

  @Get('search/title')
  @ApiOperation({ summary: 'Пошук товарів за заголовком (публічний)' })
  @ApiResponse({ status: 200, description: 'SUCCESS - Знайдено товари' })
  async searchByTitle(@Query('q') q: string, @Req() req: Request) {
    return this.productService.searchByTitle(q, req.lang)
  }

  @Get('viewed/list')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано cутність'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено'
  })
  @ApiOperation({ summary: 'Переглянуті товари' })
  async getViewedProducts(@Req() req: Request): Promise<Product[]> {
    const ids = Array.isArray(req.session?.products) ? req.session.products : []

    if (!ids.length) return []

    const viewedProducts = await this.productService.findMany(
      ids.map(Number),
      req.lang
    )

    return viewedProducts
  }

  @Get('filter')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано фільтровані сутності'
  })
  @ApiOperation({ summary: 'Отримати список фільтрованих товарів' })
  filter(@Query() query: ProductFilterDto, @Req() req: Request) {
    const {
      categories,
      parameters,
      take,
      skip,
      start_point,
      end_point,
      startAt,
      endAt
    } = query

    return this.productService.filter(
      categories,
      parameters,
      take,
      skip,
      req.lang,
      start_point,
      end_point,
      startAt,
      endAt
    )
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей'
  })
  @ApiOperation({ summary: 'Отримати частину товарів' })
  find(@Query() { take, skip }: TakeAndSkipDto, @Req() req: Request) {
    return this.productService.find(take, skip, req.lang)
  }

  @Get('packages')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано сутності'
  })
  @ApiOperation({
    summary: 'Отримати товар що відносяться до категорії "Пакування"'
  })
  findPackages(@Req() req: Request) {
    return this.productService.findPackages(req.lang)
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано cутність'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено'
  })
  @ApiOperation({ summary: 'Отримати товар' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.productService.findOne(id, req.lang, req)
  }

  @Get('url/:url')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано cутність'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено'
  })
  @ApiOperation({ summary: 'Отримати товар по url' })
  findOneByUrl(@Param('url') url: string, @Req() req: Request) {
    return this.productService.findOneByUrl(url, req.lang, req)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiOperation({
    summary: 'Cтворити товар'
  })
  @ApiResponse({
    status: 201,
    description: 'CREATED - Сутність успішно створено'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Cутність не створено'
  })
  create(@Body() dto: ProductCreateDto) {
    return this.productService.create(dto)
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({
    summary: 'Оновити товар'
  })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_UPDATED - Cутність не оновлено'
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: ProductUpdateDto) {
    return this.productService.update(id, dto)
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
  @ApiOperation({
    summary: 'Видалити товар'
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productService.delete(id)
  }

  @Patch('parameters/:id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({
    summary: 'Оновити параметри товару'
  })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_UPDATED - Cутність не оновлено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  @ApiBody({
    description: 'Масив з id параметрів',
    type: ProductParametersDto,
    required: true
  })
  updateParameters(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ProductParametersDto
  ) {
    return this.productService.updateParameters(id, dto)
  }

  @Post('/translates')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутності успішно створено'
  })
  @ApiOperation({ summary: 'Отримати всі переклади товарів' })
  @ApiBody({
    description: 'Масив перекладів',
    type: ProductCreateTranslateDto,
    isArray: true,
    required: true
  })
  createTranslates(@Body() dto: ProductCreateTranslateDto[]) {
    return this.productService.createTranslates(dto)
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
    type: ProductUpdateTranslateDto,
    isArray: true,
    required: true
  })
  @ApiOperation({ summary: 'Оновити переклади товару' })
  updateTranslates(@Body() dto: ProductUpdateTranslateDto[]) {
    return this.productService.updateTranslates(dto)
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
  @ApiOperation({ summary: 'Оновити переклади товару' })
  deleteTranslate(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteTranslate(id)
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
  @ApiOperation({ summary: 'Завантажити зображення товару' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Завантаження фото товару',
    type: ProductUploadImageDto
  })
  @ApiBody({
    description: 'Завантаження фото товару',
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
    @Param('id', ParseIntPipe) entity_id: number
  ) {
    return this.productService.uploadImages(files, entity_id)
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
  @ApiOperation({ summary: 'Видалити зображення товару' })
  deleteEntityImage(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteImage(id)
  }

  @Get(':id/images')
  @ApiOperation({ summary: 'Отримати всі зображення товару за id' })
  @ApiResponse({ status: 200, description: 'SUCCESS - Images list' })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Product not found' })
  async getImagesByProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getImagesByProduct(id)
  }
  @Delete('images')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Images successfully deleted'
  })
  @ApiResponse({
    status: 400,
    description: 'BAD_REQUEST - Invalid payload'
  })
  @ApiOperation({ summary: 'Масове видалення фото товарів по масиву id' })
  deleteEntityImages(@Body() body: ProductDeleteImagesDto) {
    const ids = body?.ids || []
    return this.productService.deleteImagesByIds(ids)
  }

  @Delete('/images/bulk')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Images successfully deleted for product'
  })
  @ApiResponse({
    status: 400,
    description: 'BAD_REQUEST - Invalid payload or id'
  })
  deleteEntityImagesByProduct(@Body() body: ProductDeleteImagesDto) {
    const ids = body?.ids || []
    return this.productService.deleteImagesByIds(ids)
  }
}
