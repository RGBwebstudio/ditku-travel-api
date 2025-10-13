import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
  Delete,
  Put,
  Headers,
  Req,
  UseGuards
} from '@nestjs/common'
import { StockCreateDto } from './dto/stock-create.dto'
import { StockUpdateDto } from './dto/stock-update.dto'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { StockService } from './stock.service'
import { Request } from 'express'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@ApiTags('Резерви товарів')
@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) {}

  @Get('all')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано всі сутності'
  })
  @ApiOperation({ summary: 'Отримати всі резерви' })
  findAllList(@Req() req: Request) {
    return this.stockService.findAllList(req.lang)
  }

  @Get()
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей'
  })
  @ApiOperation({ summary: 'Отримати частину резервів' })
  find(@Query() { take, skip }: TakeAndSkipDto, @Req() req: Request) {
    return this.stockService.findAll(take, skip, req.lang)
  }

  @Get(':id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено'
  })
  @ApiOperation({ summary: 'Отримати резерв' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.stockService.findOne(id, req.lang)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутність успішно створено'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Cутність не cтворено'
  })
  @ApiOperation({ summary: 'Cтворити резерв' })
  create(@Body() dto: StockCreateDto) {
    return this.stockService.create(dto)
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено'
  })
  @ApiOperation({ summary: 'Оновити резерв' })
  update(@Body() dto: StockUpdateDto, @Param('id', ParseIntPipe) id: number) {
    return this.stockService.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено'
  })
  @ApiResponse({
    status: 400,
    description: 'HAS_CHILDS - Сутність має нащадки, не може бути видалена'
  })
  @ApiOperation({ summary: 'Видалити резерв' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.stockService.delete(id)
  }
}
