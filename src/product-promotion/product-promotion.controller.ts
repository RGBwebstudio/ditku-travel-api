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
import { ProductPromotionCreateDto } from './dto/product-promotion-create.dto'
import { ProductPromotionUpdateDto } from './dto/product-promotion-update.dto'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { ProductPromotionService } from './product-promotion.service'
import { ProductPromotiontCreateTranslateDto } from './dto/product-promotion-create-translate.dto'
import { ProductPromotionUpdateTranslateDto } from './dto/product-promotion-update-translate.dto'
import { Request } from 'express'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@ApiTags('Акції товарів')
@Controller('product-promotion')
export class ProductPromotionController {
  constructor(private productPromotionService: ProductPromotionService) {}

  @Get('all')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано всі сутності'
  })
  @ApiOperation({ summary: 'Отримати весь список акцій' })
  findAllList(@Req() req: Request) {
    return this.productPromotionService.findAllList(req.lang)
  }

  @Get()
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей'
  })
  @ApiOperation({ summary: 'Отримати частину списку акцій' })
  find(@Query() { take, skip }: TakeAndSkipDto, @Req() req: Request) {
    return this.productPromotionService.findAll(take, skip, req.lang)
  }

  @Get(':id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано сутність'
  })
  @ApiOperation({ summary: 'Отримати акцію' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.productPromotionService.findOne(id, req.lang)
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
  @ApiOperation({ summary: 'Cтворити акцію' })
  create(@Body() dto: ProductPromotionCreateDto) {
    return this.productPromotionService.create(dto)
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Cутність успішно оновлено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  @ApiOperation({ summary: 'Оновити акцію' })
  update(
    @Body() dto: ProductPromotionUpdateDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.productPromotionService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Cутність успішно виделно'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  @ApiResponse({
    status: 400,
    description: 'HAS_CHILDS - Сутність має нащадки, не може бути видалена'
  })
  @ApiOperation({ summary: 'Видалити акцію' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productPromotionService.delete(id)
  }

  @Post('/translates')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Cутності успішно створено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено'
  })
  @ApiBody({
    description: 'Список перекладів',
    type: ProductPromotiontCreateTranslateDto,
    isArray: true,
    required: true
  })
  @ApiOperation({ summary: 'Cтворити переклади для акції' })
  createTranslates(@Body() dto: ProductPromotiontCreateTranslateDto[]) {
    return this.productPromotionService.createTranslates(dto)
  }

  @Put(':id/translates')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Cутності успішно оновлено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено'
  })
  @ApiBody({
    description: 'Список перекладів',
    type: ProductPromotionUpdateTranslateDto,
    isArray: true,
    required: true
  })
  @ApiOperation({ summary: 'Оновити переклади для акції' })
  updateTranslates(@Body() dto: ProductPromotionUpdateTranslateDto[]) {
    return this.productPromotionService.updateTranslates(dto)
  }

  @Delete(':id/translate')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Cутність успішно видалено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено'
  })
  @ApiOperation({ summary: 'Видалити акцію' })
  deleteTranslate(@Param('id', ParseIntPipe) id: number) {
    return this.productPromotionService.deleteTranslate(id)
  }
}
