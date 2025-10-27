import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common'
import { SeoFilterService } from './seo-filter.service'
import { SeoFilterCreateDto } from './dto/seo-filter-create.dto'
import { SeoFilterUpdateDto } from './dto/seo-filter-update.dto'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'
import { ApiTags, ApiOperation } from '@nestjs/swagger'

@ApiTags('SEO-фільтри')
@Controller('seo-filter')
export class SeoFilterController {
  constructor(private readonly seoFilterService: SeoFilterService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати seo-фільтри' })
  async findAll() {
    return this.seoFilterService.find()
  }

  @Get('by-url/:url')
  @ApiOperation({ summary: 'Отримати seo-фільтр по url' })
  async findByUrl(@Param('url') url: string) {
    return this.seoFilterService.findOneByUrl(url)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати seo-фільтр' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.seoFilterService.findOne(id)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Створити seo-фільтр' })
  async create(@Body() dto: SeoFilterCreateDto) {
    return this.seoFilterService.create(dto)
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Оновити seo-фільтр' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SeoFilterUpdateDto
  ) {
    return this.seoFilterService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Видалити seo-фільтр' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.seoFilterService.delete(id)
  }
}
