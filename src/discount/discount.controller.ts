import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common'
import { DiscountService } from './discount.service'
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger'
import { CreateDiscountDto } from './dto/create-discount.dto'
import { UpdateDiscountDto } from './dto/update-discount.dto'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'
import { Discount } from './entities/discount.entity'

@ApiTags('Знижки')
@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список знижок' })
  @ApiResponse({ status: 200, description: 'УСПІШНО' })
  async findAll() {
    return this.discountService.findAll()
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID або custom_id', example: 1 })
  @ApiOperation({ summary: 'Отримати знижку за ID або custom_id' })
  @ApiResponse({ status: 200, description: 'УСПІШНО', type: Discount })
  async findOne(@Param('id') id: number | string) {
    return this.discountService.findOne(id)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Створити знижку' })
  @ApiResponse({ status: 201, description: 'УСПІШНО', type: Discount })
  async create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto)
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  @ApiParam({ name: 'id', description: 'Ідентифікатор (ID)', example: 1 })
  @ApiOperation({ summary: 'Оновити знижку' })
  @ApiResponse({ status: 200, description: 'УСПІШНО' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDiscountDto: UpdateDiscountDto
  ) {
    return this.discountService.update(id, updateDiscountDto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiParam({ name: 'id', description: 'Ідентифікатор (ID)', example: 1 })
  @ApiOperation({ summary: 'Видалити знижку' })
  @ApiResponse({ status: 200, description: 'УСПІШНО' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.discountService.remove(id)
  }
}
