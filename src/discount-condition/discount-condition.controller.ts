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
import { DiscountConditionService } from './discount-condition.service'
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger'
import { CreateDiscountConditionDto } from './dto/create-discount-condition.dto'
import { UpdateDiscountConditionDto } from './dto/update-discount-condition.dto'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'
import { DiscountCondition } from './entities/discount-condition.entity'

@ApiTags('Умови знижки')
@Controller('discount-condition')
export class DiscountConditionController {
  constructor(
    private readonly discountConditionService: DiscountConditionService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список умов знижок' })
  @ApiResponse({ status: 200, description: 'УСПІШНО' })
  async findAll() {
    return this.discountConditionService.findAll()
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID', example: 1 })
  @ApiOperation({ summary: 'Отримати умову знижки за ID' })
  @ApiResponse({ status: 200, description: 'УСПІШНО', type: DiscountCondition })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.discountConditionService.findOne(id)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Створити умову знижки' })
  @ApiResponse({ status: 201, description: 'УСПІШНО', type: DiscountCondition })
  async create(@Body() createDiscountConditionDto: CreateDiscountConditionDto) {
    return this.discountConditionService.create(createDiscountConditionDto)
  }

  @Put(':id')
  @UseGuards(AuthAdminGuard)
  @ApiParam({ name: 'id', description: 'Ідентифікатор (ID)', example: 1 })
  @ApiOperation({ summary: 'Оновити умову знижки' })
  @ApiResponse({ status: 200, description: 'УСПІШНО' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDiscountConditionDto: UpdateDiscountConditionDto
  ) {
    return this.discountConditionService.update(id, updateDiscountConditionDto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiParam({ name: 'id', description: 'Ідентифікатор (ID)', example: 1 })
  @ApiOperation({ summary: 'Видалити умову знижки' })
  @ApiResponse({ status: 200, description: 'УСПІШНО' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.discountConditionService.delete(id)
  }
}
