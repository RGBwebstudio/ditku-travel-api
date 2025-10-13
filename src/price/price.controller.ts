import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common'
import { PriceService } from './price.service'
import { CreatePriceDto } from './dto/create-price.dto'
import { UpdatePriceDto } from './dto/update-price.dto'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody
} from '@nestjs/swagger'
import { AuthAdminGuard } from '../auth/auth-admin.guard'
import { Price } from './entities/price.entity'

@ApiTags('Ціни')
@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список усіх цін' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей',
    type: [Price]
  })
  async findAll() {
    return await this.priceService.findAll()
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Унікальний ідентифікатор ціни',
    example: 1
  })
  @ApiOperation({ summary: 'Отримати ціну за ID' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано сутність',
    type: Price
  })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Cутність не знайдено' })
  async findOne(@Param('id') id: number | string) {
    return await this.priceService.findOne(id)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Створити нову ціну' })
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутність успішно створено',
    type: Price
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Cутність не створено'
  })
  @ApiResponse({
    status: 401,
    description: 'UNAUTHORIZED - Неавторизований доступ'
  })
  @ApiBody({ type: CreatePriceDto })
  async create(@Body() dto: CreatePriceDto) {
    return await this.priceService.create(dto)
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  @ApiParam({
    name: 'id',
    description: 'Унікальний ідентифікатор ціни',
    example: 1
  })
  @ApiOperation({ summary: 'Оновити ціну' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Cутність успішно оновлено',
    type: Price
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Cутність не створено'
  })
  @ApiResponse({
    status: 401,
    description: 'UNAUTHORIZED - Неавторизований доступ'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  @ApiBody({ type: UpdatePriceDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePriceDto
  ) {
    return await this.priceService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiParam({
    name: 'id',
    description: 'Унікальний ідентифікатор ціни',
    example: 1
  })
  @ApiOperation({ summary: 'Видалити ціну' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Cутність успішно видалено'
  })
  @ApiResponse({
    status: 401,
    description: 'UNAUTHORIZED - Неавторизований доступ'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.priceService.remove(id)
  }
}
