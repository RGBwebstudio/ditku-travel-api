import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ImageCategoryService } from '../services/image-category.service'
import { CreateImageCategoryDto } from '../dto/create-image-category.dto'
import { UpdateImageCategoryDto } from '../dto/update-image-category.dto'
import { ImageCategoryQueryDto } from '../dto/image-category-query.dto'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

@ApiTags('Gallery')
@ApiBearerAuth()
@UseGuards(AuthAdminGuard)
@Controller('admin/gallery/categories')
export class ImageCategoryAdminController {
  constructor(private readonly categoryService: ImageCategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new image category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() dto: CreateImageCategoryDto) {
    return await this.categoryService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all image categories' })
  @ApiQuery({
    name: 'parentId',
    required: false,
    type: Number,
    description: 'Filter by parent category ID',
  })
  @ApiResponse({ status: 200, description: 'List of categories' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(@Query() query: ImageCategoryQueryDto) {
    return await this.categoryService.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get image category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID', type: Number })
  @ApiResponse({ status: 200, description: 'Category found' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update image category' })
  @ApiParam({ name: 'id', description: 'Category ID', type: Number })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateImageCategoryDto) {
    return await this.categoryService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete image category' })
  @ApiParam({ name: 'id', description: 'Category ID', type: Number })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Category has related images',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.delete(id)
  }
}
