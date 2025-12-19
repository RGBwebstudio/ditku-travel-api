import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { MailLayoutService } from './mail-layout.service'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { CreateMailLayoutDto } from './dto/create-mail-layout.dto'
import { UpdateMailLayoutDto } from './dto/update-mail-layout.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

@ApiTags('Шаблони листів')
@Controller('mail-layout')
export class MailLayoutController {
  constructor(private mailLayoutService: MailLayoutService) {}

  @Get()
  async findAll(@Query() { take, skip }: TakeAndSkipDto) {
    return this.mailLayoutService.findAll(take, skip)
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mailLayoutService.findOne(id)
  }

  @UseGuards(AuthAdminGuard)
  @Post('create')
  @ApiOperation({ summary: 'Створення шаблону листа' })
  async create(@Body() dto: CreateMailLayoutDto) {
    return this.mailLayoutService.create(dto)
  }

  @UseGuards(AuthAdminGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Оновити шаблон листа' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMailLayoutDto
  ) {
    return this.mailLayoutService.update(id, dto)
  }

  @UseGuards(AuthAdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Видалити шаблон листа' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.mailLayoutService.delete(id)
  }
}
