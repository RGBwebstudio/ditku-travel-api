import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  Req,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'

import { Request } from 'express'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

import { AddPostImageDto } from './dto/add-post-image.dto'
import { PostCreateImageDto } from './dto/post-create-image.dto'
import { PostCreateTranslateDto } from './dto/post-create-translate.dto'
import { PostCreateDto } from './dto/post-create.dto'
import { PostDeleteImagesDto } from './dto/post-delete-images.dto'
import { PostFilterDto } from './dto/post-filter.dto'
import { PostQueryDto } from './dto/post-query.dto'
import { PostUpdateImageDto } from './dto/post-update-image.dto'
import { PostUpdateTranslateDto } from './dto/post-update-translate.dto'
import { PostUpdateDto } from './dto/post-update.dto'
import { PostService } from './post.service'

@ApiTags('Пости')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей',
  })
  @ApiOperation({ summary: 'Отримати частину постів' })
  find(@Query() query: PostQueryDto, @Req() req: Request) {
    const { take, skip, filter } = query
    const filterDto: Partial<PostFilterDto> = {
      ...filter,
      take,
      skip,
    }

    return this.postService.findAll(filterDto as PostFilterDto, req.lang)
  }

  @Get('filter')
  @ApiOperation({ summary: 'Отримати список постів з фільтрацією' })
  @ApiResponse({ status: 200, description: 'Список постів успішно отримано' })
  async findAll(@Query() filter: PostFilterDto, @Req() req: Request) {
    return this.postService.findAll(filter, req.lang)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати пост за ID' })
  @ApiResponse({ status: 200, description: 'Пост знайдено' })
  @ApiResponse({ status: 404, description: 'Пост не знайдено' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.postService.findOne(id, req.lang)
  }

  @Get('url/:url')
  @ApiOperation({ summary: 'Отримати пост за URL' })
  @ApiResponse({ status: 200, description: 'Пост знайдено' })
  @ApiResponse({ status: 404, description: 'Пост не знайдено' })
  async findByUrl(@Param('url') url: string, @Req() req: Request) {
    return this.postService.findByUrl(url, req.lang)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Створити новий пост' })
  @ApiResponse({ status: 201, description: 'Пост успішно створено' })
  @ApiResponse({ status: 400, description: 'Некоректні дані' })
  async create(@Body() createPostDto: PostCreateDto) {
    return this.postService.create(createPostDto)
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Оновити пост' })
  @ApiResponse({ status: 200, description: 'Пост успішно оновлено' })
  @ApiResponse({ status: 404, description: 'Пост не знайдено' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: PostUpdateDto) {
    return this.postService.update(id, updatePostDto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiOperation({ summary: 'Видалити пост' })
  @ApiResponse({ status: 204, description: 'Пост успішно видалено' })
  @ApiResponse({ status: 404, description: 'Пост не знайдено' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.postService.remove(id)
  }

  @Post(':id/translates')
  @UseGuards(AuthAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Створити переклад для посту' })
  @ApiResponse({ status: 201, description: 'Переклад успішно створено' })
  async createTranslate(@Param('id', ParseIntPipe) postId: number, @Body() createTranslateDto: PostCreateTranslateDto) {
    return this.postService.createTranslate(postId, createTranslateDto)
  }

  @Put('translates/:translateId')
  @UseGuards(AuthAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Оновити переклад посту' })
  @ApiResponse({ status: 200, description: 'Переклад успішно оновлено' })
  async updateTranslate(
    @Param('translateId', ParseIntPipe) translateId: number,
    @Body() updateTranslateDto: PostUpdateTranslateDto
  ) {
    return this.postService.updateTranslate(translateId, updateTranslateDto)
  }

  @Delete('translates/:translateId')
  @UseGuards(AuthAdminGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiOperation({ summary: 'Видалити переклад посту' })
  @ApiResponse({ status: 204, description: 'Переклад успішно видалено' })
  async removeTranslate(@Param('translateId', ParseIntPipe) translateId: number) {
    return this.postService.removeTranslate(translateId)
  }

  @Post(':id/add-image')
  @UseGuards(AuthAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add image to post (from Gallery)' })
  @ApiResponse({ status: 201, description: 'Image added successfully' })
  async addImage(@Param('id', ParseIntPipe) postId: number, @Body() dto: AddPostImageDto) {
    return this.postService.addImage(postId, dto)
  }

  @Post(':id/images')
  @UseGuards(AuthAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Створити зображення для посту' })
  @ApiResponse({ status: 201, description: 'Зображення успішно створено' })
  async createImage(@Param('id', ParseIntPipe) postId: number, @Body() createImageDto: PostCreateImageDto) {
    return this.postService.createImage(postId, createImageDto)
  }

  @Put('images/:imageId')
  @UseGuards(AuthAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Оновити зображення посту' })
  @ApiResponse({ status: 200, description: 'Зображення успішно оновлено' })
  async updateImage(@Param('imageId', ParseIntPipe) imageId: number, @Body() updateImageDto: PostUpdateImageDto) {
    return this.postService.updateImage(imageId, updateImageDto)
  }

  @Delete(':id/images')
  @UseGuards(AuthAdminGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiOperation({ summary: 'Видалити множинні зображення посту' })
  @ApiResponse({ status: 204, description: 'Зображення успішно видалено' })
  async deleteImages(@Param('id', ParseIntPipe) postId: number, @Body() deleteImagesDto: PostDeleteImagesDto) {
    return this.postService.deleteImages(postId, deleteImagesDto)
  }

  @Delete('images/:imageId')
  @UseGuards(AuthAdminGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiOperation({ summary: 'Видалити зображення посту' })
  @ApiResponse({ status: 204, description: 'Зображення успішно видалено' })
  async removeImage(@Param('imageId', ParseIntPipe) imageId: number) {
    return this.postService.removeImage(imageId)
  }
}
