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
import { SectionService } from './section.service'
import { SectionCreateDto } from './dto/section-create.dto'
import { SectionUpdateDto } from './dto/section-update.dto'
import { SectionCreateTranslateDto } from './dto/section-create-translate.dto'
import { SectionUpdateTranslateDto } from './dto/section-update-translate.dto'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger'

@ApiTags('Рубрики')
@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати рубрики' })
  async findAll() {
    return this.sectionService.find()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати рубрику' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sectionService.findOne(id)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Створити рубрику' })
  async create(@Body() dto: SectionCreateDto) {
    return this.sectionService.create(dto)
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Оновити рубрику' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SectionUpdateDto
  ) {
    return this.sectionService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Видалити рубрику' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.sectionService.delete(id)
  }

  @Post('/translates')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Створити переклади для рубрики' })
  @ApiBody({ type: SectionCreateTranslateDto, isArray: true })
  async createTranslates(@Body() dto: SectionCreateTranslateDto[]) {
    return this.sectionService.createTranslates(dto)
  }

  @Put(':id/translates')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Оновити переклади для рубрики' })
  @ApiBody({ type: SectionUpdateTranslateDto, isArray: true })
  async updateTranslates(@Body() dto: SectionUpdateTranslateDto[]) {
    return this.sectionService.updateTranslates(dto)
  }

  @Delete('/translate/:id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Видалити переклад рубрики' })
  async deleteTranslate(@Param('id', ParseIntPipe) id: number) {
    return this.sectionService.deleteTranslate(id)
  }
}
