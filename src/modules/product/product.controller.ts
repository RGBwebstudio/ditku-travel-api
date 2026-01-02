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
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { Request } from 'express'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'
import { RatingService } from 'src/modules/product-rating/rating.service'

import { AddProductImageDto } from './dto/add-product-image.dto'
import { ProductCreateTranslateDto } from './dto/product-create-translate.dto'
import { ProductCreateDto } from './dto/product-create.dto'
import { ProductDeleteImagesDto } from './dto/product-delete-images.dto'
import { ProductFilterDto } from './dto/product-filter.dto'
import { ProductParametersDto } from './dto/product-parameters.dto'
import { ProductRecommendedDto } from './dto/product-recommended.dto'
import { ProductUpdateTranslateDto } from './dto/product-update-translate.dto'
import { ProductUpdateDto } from './dto/product-update.dto'
import { Product } from './entities/product.entity'
import { ProductService } from './product.service'

@ApiTags('Товари')
@Controller('product')
export class ProductController {
  constructor(
    private productService: ProductService,
    private ratingService: RatingService
  ) {}

  @Get(':id/reviews')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано рейтинги товару',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Товар не знайдено',
  })
  @ApiOperation({ summary: 'Отримати всі рейтинги товару' })
  async getProductReviews(@Param('id', ParseIntPipe) id: number) {
    const result = await this.ratingService.getRatingsByProduct(id)

    return {
      rating: result.averageRating,
      rating_count: result.totalRatings,
      ratings: result.ratings,
    }
  }

  @Get('search')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано cутність',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено',
  })
  @ApiOperation({
    summary: 'Пошук товарів (id, title) по q, максимум 20)',
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
    description: 'SUCCESS - Успішно отримано cутність',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено',
  })
  @ApiOperation({ summary: 'Переглянуті товари' })
  async getViewedProducts(@Req() req: Request): Promise<Product[]> {
    const ids = Array.isArray(req.session?.products) ? req.session.products : []

    if (!ids.length) return []

    const viewedProducts = await this.productService.findMany(ids.map(Number), req.lang)

    return viewedProducts
  }

  @Get('filter')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано фільтровані сутності',
  })
  @ApiOperation({ summary: 'Отримати список фільтрованих товарів' })
  filter(@Query() query: ProductFilterDto, @Req() req: Request) {
    const { categories, parameters, sections, take, skip, start_point, end_point, startAt, endAt, seo_filter } = query

    return this.productService.filter(
      categories,
      parameters,
      sections,
      take,
      skip,
      req.lang,
      start_point,
      end_point,
      startAt,
      endAt,
      seo_filter
    )
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей',
  })
  @ApiOperation({ summary: 'Отримати частину товарів' })
  find(@Query() { take, skip }: TakeAndSkipDto, @Req() req: Request) {
    return this.productService.find(take, skip, req.lang)
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано cутність',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено',
  })
  @ApiOperation({ summary: 'Отримати товар' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.productService.findOne(id, req.lang, req)
  }

  @Get(':id/recommendations')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Отримати рекомендовані товари для товару' })
  async getRecommendations(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.productService.getRecommendedOfProduct(id, req.lang)
  }

  @Get('category/:categoryId/products')
  @ApiOperation({ summary: 'Отримати товари по категорії (для адмінки)' })
  @ApiResponse({ status: 200, description: 'SUCCESS - Знайдено товари' })
  async getByCategory(@Param('categoryId', ParseIntPipe) categoryId: number, @Req() req: Request) {
    return this.productService.findByCategory(categoryId, req.lang)
  }

  @Get('url/:url')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано cутність',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено',
  })
  @ApiOperation({ summary: 'Отримати товар по url' })
  findOneByUrl(@Param('url') url: string, @Req() req: Request) {
    return this.productService.findOneByUrl(url, req.lang, req)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiOperation({
    summary: 'Cтворити товар',
  })
  @ApiResponse({
    status: 201,
    description: 'CREATED - Сутність успішно створено',
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Cутність не створено',
  })
  create(@Body() dto: ProductCreateDto) {
    return this.productService.create(dto)
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({
    summary: 'Оновити товар',
  })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено',
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_UPDATED - Cутність не оновлено',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: ProductUpdateDto) {
    return this.productService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено',
  })
  @ApiResponse({
    status: 400,
    description: 'HAS_CHILDS - Сутність має нащадки, не може бути видалена',
  })
  @ApiOperation({
    summary: 'Видалити товар',
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productService.delete(id)
  }

  @Patch('parameters/:id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({
    summary: 'Оновити параметри товару',
  })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено',
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_UPDATED - Cутність не оновлено',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено',
  })
  @ApiBody({
    description: 'Масив з id параметрів',
    type: ProductParametersDto,
    required: true,
  })
  updateParameters(@Param('id', ParseIntPipe) id: number, @Body() dto: ProductParametersDto) {
    return this.productService.updateParameters(id, dto)
  }

  @Patch(':id/recommendations')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Оновити список рекомендованих товарів для товару' })
  @ApiBody({
    description: 'Масив id рекомендованих товарів',
    type: ProductRecommendedDto,
  })
  async updateRecommendations(@Param('id', ParseIntPipe) id: number, @Body() dto: ProductRecommendedDto) {
    const ids = Array.isArray(dto?.productIds) ? dto.productIds : []
    return this.productService.updateRecommendedProducts(id, ids)
  }

  @Post('/translates')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутності успішно створено',
  })
  @ApiOperation({ summary: 'Отримати всі переклади товарів' })
  @ApiBody({
    description: 'Масив перекладів',
    type: ProductCreateTranslateDto,
    isArray: true,
    required: true,
  })
  createTranslates(@Body() dto: ProductCreateTranslateDto[]) {
    return this.productService.createTranslates(dto)
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
    type: ProductUpdateTranslateDto,
    isArray: true,
    required: true,
  })
  @ApiOperation({ summary: 'Оновити переклади товару' })
  updateTranslates(@Body() dto: ProductUpdateTranslateDto[]) {
    return this.productService.updateTranslates(dto)
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
  @ApiOperation({ summary: 'Оновити переклади товару' })
  deleteTranslate(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteTranslate(id)
  }

  @Post('add-image/:id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Add image to product (from Gallery)' })
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Image added to product',
  })
  @ApiResponse({
    status: 400,
    description: 'BAD_REQUEST',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'Product ID',
  })
  async addImage(@Param('id', ParseIntPipe) id: number, @Body() dto: AddProductImageDto) {
    return this.productService.addImage(id, dto)
  }

  @Delete('/image/:id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Cутність успішно видалено',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено',
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
    description: 'SUCCESS - Images successfully deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'BAD_REQUEST - Invalid payload',
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
    description: 'SUCCESS - Images successfully deleted for product',
  })
  @ApiResponse({
    status: 400,
    description: 'BAD_REQUEST - Invalid payload or id',
  })
  deleteEntityImagesByProduct(@Body() body: ProductDeleteImagesDto) {
    const ids = body?.ids || []
    return this.productService.deleteImagesByIds(ids)
  }
}
