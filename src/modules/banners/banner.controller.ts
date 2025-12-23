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
  UseInterceptors,
  UploadedFiles,
  Patch,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'

import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { FilesSizeValidationPipe } from 'src/common/pipes/files-upload.pipe'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

import { BannerService } from './banner.service'
import { BannerCreateDto } from './dto/banner-create.dto'
import { BannerUpdateDto } from './dto/banner-update.dto'

@ApiTags('Групи банерів')
@Controller('banner-group')
export class BannerController {
  constructor(private bannerService: BannerService) {}

  @Get('all')
  @ApiOperation({ summary: 'Отримати всі групи банерів' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано всі сутності',
  })
  findAllList() {
    return this.bannerService.findAllList()
  }

  @Get('main-page')
  @ApiOperation({ summary: 'Отримати банери для головної сторінки' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано всі сутності',
  })
  findMainPageBanners() {
    return this.bannerService.findMainPageBanners()
  }

  @Get()
  @ApiOperation({ summary: 'Отримати частину банерних груп' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей',
  })
  find(@Query() { take, skip }: TakeAndSkipDto) {
    return this.bannerService.findAll(take, skip)
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано сутність',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено',
  })
  @ApiOperation({ summary: 'Отримати банерну групу' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bannerService.findOne(id)
  }

  @Post('create')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'CREATED - Сутність успішно створено',
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Cутність не створено',
  })
  @ApiOperation({ summary: 'Cтворити банерну групу' })
  create(@Body() dto: BannerCreateDto) {
    return this.bannerService.create(dto)
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено',
  })
  @ApiOperation({ summary: 'Оновити банерну групу' })
  update(@Body() dto: BannerUpdateDto, @Param('id', ParseIntPipe) id: number) {
    return this.bannerService.update(id, dto)
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
  @ApiOperation({ summary: 'Видалити банерну групу' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.bannerService.delete(id)
  }

  @Post('upload/:id')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: 'Завантажити фото банеру' })
  @ApiResponse({
    status: 201,
    description: "SUCCESS - Сутність успішно завантажено і прикріплено до об'єкту",
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Сутність не створено',
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_UPLOADED - Сутність не завантажено',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Завантаження фото банеру',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        link: { type: 'string' },
      },
      required: ['link'],
    },
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'Id банеру',
  })
  uploadFile(
    @UploadedFiles(new FilesSizeValidationPipe()) files: Express.Multer.File[],
    @Param('id', ParseIntPipe) entity_id: number,
    @Body('link') link: string
  ) {
    return this.bannerService.uploadImages(files, entity_id, link)
  }

  @Delete('/image/:id')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено',
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено',
  })
  @ApiOperation({ summary: 'Видалити фото банеру' })
  deleteEntityImage(@Param('id', ParseIntPipe) id: number) {
    return this.bannerService.deleteImage(id)
  }

  @Patch('/image/order/:id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Оновити порядок зображень банерної групи' })
  @ApiResponse({ status: 200, description: 'SUCCESS - Order updated' })
  updateImagesOrder(@Param('id', ParseIntPipe) id: number, @Body('orders') orders: { id: number; order: number }[]) {
    return this.bannerService.reorderImages(id, orders)
  }

  @Put('/image/:id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Оновити посилання зображення' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено',
  })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Сутність не знайдено' })
  updateEntityImage(@Param('id', ParseIntPipe) id: number, @Body('link') link: string) {
    return this.bannerService.updateImage(id, link)
  }
}
