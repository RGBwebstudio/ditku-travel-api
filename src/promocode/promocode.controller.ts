import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common'
import { PromocodeService } from './promocode.service'
import { CreatePromocodeDto } from './dto/create-promocode.dto'
import { UpdatePromocodeDto } from './dto/update-promocode.dto'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@ApiTags('Промокоди')
@Controller('promocode')
export class PromocodeController {
  constructor(private readonly promocodeService: PromocodeService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей'
  })
  @ApiOperation({ summary: 'Отримати всі промокоди' })
  findAll(@Query() { take, skip }: TakeAndSkipDto) {
    return this.promocodeService.findAll(take, skip)
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно отримано'
  })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Сутність не знайдено' })
  @ApiOperation({ summary: 'Отримати промокод по id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.promocodeService.findOne(id)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутність успішно створено'
  })
  @ApiOperation({ summary: 'Створити промокод' })
  create(@Body() dto: CreatePromocodeDto) {
    return this.promocodeService.create(dto)
  }

  @Patch(':id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено'
  })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Сутність не знайдено' })
  @ApiOperation({ summary: 'Оновити промокод' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePromocodeDto
  ) {
    return this.promocodeService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено'
  })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Сутність не знайдено' })
  @ApiOperation({ summary: 'Видалити промокод' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.promocodeService.delete(id)
  }
}
