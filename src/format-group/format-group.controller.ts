import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  Body,
  Query,
  UseGuards
} from '@nestjs/common'
import { FormatGroupService } from './format-group.service'
import { FormatGroupCreateDto } from './dto/format-group-create.dto'
import { FormatGroupUpdateDto } from './dto/format-group-update.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'

@ApiTags('Формат груп')
@Controller('format-group')
export class FormatGroupController {
  constructor(private readonly service: FormatGroupService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати частину формат груп' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей'
  })
  find(@Query() { take, skip }: TakeAndSkipDto) {
    return this.service.find(take, skip)
  }

  @Get('search')
  @ApiOperation({ summary: 'Пошук формат груп за заголовком' })
  @ApiResponse({ status: 200, description: 'SUCCESS - Знайдено формат групи' })
  search(@Query('q') q: string) {
    return this.service.searchByTitle(q)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати формат групу' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано сутність'
  })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Cутність не знайдено' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Створити формат групу' })
  @ApiResponse({
    status: 201,
    description: 'CREATED - Сутність успішно створено'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Cутність не створено'
  })
  create(@Body() dto: FormatGroupCreateDto) {
    return this.service.create(dto)
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Оновити формат групу' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_UPDATED - Cутність не оновлено'
  })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Cутність не знайдено' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: FormatGroupUpdateDto
  ) {
    return this.service.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Видалити формат групу' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено'
  })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Cутність не знайдено' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id)
  }
}
