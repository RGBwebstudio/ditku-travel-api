import { Controller, Get, Body, Put, UseGuards, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'

import { BlogService } from './blog.service'
import { GetBlogPageDto } from './dto/get-blog-page.dto'
import { UpdateBlogPageDto } from './dto/update-blog-page.dto'
import { BlogPage } from './entities/blog-page.entity'
import { AuthAdminGuard } from '../../core/auth/auth-admin.guard'

@ApiTags('Блог')
@Controller('blog/page')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати налаштування сторінки блогу' })
  @ApiResponse({ status: 200, type: BlogPage })
  async find(): Promise<BlogPage> {
    return this.blogService.find()
  }

  @Get('view')
  @ApiOperation({ summary: 'Отримати публічні дані сторінки блогу (все в одному)' })
  @ApiResponse({ status: 200 })
  async getPublicView(@Query() query: GetBlogPageDto) {
    return this.blogService.getPublicView(query)
  }

  @Put()
  @UseGuards(AuthAdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Оновити налаштування сторінки блогу' })
  @ApiResponse({ status: 200, type: BlogPage })
  async update(@Body() dto: UpdateBlogPageDto): Promise<BlogPage> {
    return this.blogService.update(dto)
  }
}
