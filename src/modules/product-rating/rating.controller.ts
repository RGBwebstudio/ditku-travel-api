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
  Req
} from '@nestjs/common'
import { RatingCreateDto } from './dto/rating-create.dto'
import { RatingUpdateDto } from './dto/rating-update.dto'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { RatingService } from './rating.service'
import { Request } from 'express'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Рейтинг товарів')
@Controller('rating')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано всі сутності'
  })
  @ApiOperation({ summary: 'Отримати всі рейтинги товарів' })
  findAllList(@Req() req: Request) {
    return this.ratingService.findAllList(req.lang)
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано чистну сутностей'
  })
  @ApiOperation({ summary: 'Отримати частину рейтингів товарів' })
  find(@Query() { take, skip }: TakeAndSkipDto, @Req() req: Request) {
    return this.ratingService.findAll(take, skip, req.lang)
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано сутність'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено'
  })
  @ApiOperation({ summary: 'Отримати оцінку товару' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.ratingService.findOne(id, req.lang)
  }

  @Get('/get-user-estimate/:productId')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано сутність'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено'
  })
  @ApiOperation({
    summary: 'Отримати оцінку товару від конкретного юзера (deprecated)'
  })
  findEstimateOfuser(@Param('productId', ParseIntPipe) id: number) {
    return this.ratingService.getRatingsByProduct(id)
  }

  @Get('/product/:productId')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано рейтинги товару'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Товар не знайдено'
  })
  @ApiOperation({ summary: 'Отримати всі рейтинги товару' })
  async getRatingsByProduct(
    @Param('productId', ParseIntPipe) productId: number
  ) {
    const result = await this.ratingService.getRatingsByProduct(productId)

    return {
      rating: result.averageRating,
      rating_count: result.totalRatings,
      ratings: result.ratings
    }
  }

  @Post()
  @ApiOperation({ summary: 'Cтворити оцінку товару (доступно всім)' })
  @ApiResponse({
    status: 201,
    description: 'CREATED - Сутність успішно створено'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Cутність не створено'
  })
  @ApiResponse({
    status: 403,
    description: 'FORBIDDEN - Ви не можете залишити рейтинг для цього товару'
  })
  setRating(@Body() dto: RatingCreateDto) {
    return this.ratingService.setRating(dto)
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено'
  })
  @ApiOperation({ summary: 'Оновити оцінку товару' })
  update(@Body() dto: RatingUpdateDto, @Param('id', ParseIntPipe) id: number) {
    return this.ratingService.update(id, dto)
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено'
  })
  @ApiResponse({
    status: 400,
    description: 'HAS_CHILDS - Сутність має нащадки, не може бути видалена'
  })
  @ApiOperation({ summary: 'Видалити оцінку товару' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.ratingService.delete(id)
  }
}
