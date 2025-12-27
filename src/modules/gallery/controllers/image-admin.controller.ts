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
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

import { Request } from 'express'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

import { DeleteImageResponseDto } from '../dto/delete-image-response.dto'
import { ImageListResponseDto } from '../dto/image-list-response.dto'
import { ImageQueryDto } from '../dto/image-query.dto'
import { ImageResponseDto } from '../dto/image-response.dto'
import { UpdateImageDto } from '../dto/update-image.dto'
import { UploadImageDto } from '../dto/upload-image.dto'
import { GalleryFileUploadPipe } from '../pipes/gallery-file-upload.pipe'
import { ImageService } from '../services/image.service'

@ApiTags('Gallery')
@ApiBearerAuth()
@UseGuards(AuthAdminGuard)
@Controller('admin/gallery/images')
export class ImageAdminController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file to upload',
    type: UploadImageDto,
  })
  @ApiQuery({
    name: 'lg',
    required: true,
    type: String,
    description: 'Large size format (e.g., "1920x1080")',
  })
  @ApiQuery({
    name: 'md',
    required: true,
    type: String,
    description: 'Medium size format (e.g., "1280x720")',
  })
  @ApiQuery({
    name: 'sm',
    required: true,
    type: String,
    description: 'Small size format (e.g., "640x360")',
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    type: ImageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid file or format',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async upload(
    @Req() req: Request,
    @UploadedFile(new GalleryFileUploadPipe()) file: Express.Multer.File,
    @Query('categoryId', new ParseIntPipe({ optional: true }))
    categoryId?: number,
    @Query('lg') lg?: string,
    @Query('md') md?: string,
    @Query('sm') sm?: string
  ) {
    return await this.imageService.uploadImage(file, categoryId || null, lg, md, sm)
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated list of images with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'originalName', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of images',
    type: ImageListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(@Query() query: ImageQueryDto) {
    return await this.imageService.findAll(query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get image by ID' })
  @ApiParam({ name: 'id', description: 'Image ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Image found',
    type: ImageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Image not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.imageService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update image metadata' })
  @ApiParam({ name: 'id', description: 'Image ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Image updated successfully',
    type: ImageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateImageDto) {
    return await this.imageService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete image' })
  @ApiParam({ name: 'id', description: 'Image ID', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Image deleted successfully',
    type: DeleteImageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Image not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.imageService.delete(id)
  }
}
