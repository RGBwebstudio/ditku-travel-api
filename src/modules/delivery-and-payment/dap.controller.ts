import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Put,
  UseGuards,
  Req
} from '@nestjs/common'
import { DAPService } from './dap.service'
import { CreateDAPDto } from './dto/create-dap.dto'
import { UpdateDAPDto } from './dto/update-dap.dto'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'
import { DAPCreateTranslateDto } from './dto/dap-create-translate.dto'
import { DAPUpdateTranslateDto } from './dto/dap-update-translate.dto'
import { Request } from 'express'

@ApiTags('Доставка та оплата')
@Controller('delivery-and-payment')
export class DAPController {
  constructor(private readonly DAPService: DAPService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутності успішно отримано'
  })
  @ApiOperation({ summary: 'Отримати всі записи' })
  findAll(@Query() { take, skip }: TakeAndSkipDto, @Req() req: Request) {
    return this.DAPService.findAll(take, skip, req.lang)
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно отримано'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено'
  })
  @ApiOperation({ summary: 'Отримати запис' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.DAPService.findOne(id, req.lang)
  }

  @Post()
  @ApiOperation({ summary: 'Створити запис' })
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'CREATED - Сутність успішно створено'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Cутність не cтворено'
  })
  create(@Body() dto: CreateDAPDto) {
    return this.DAPService.create(dto)
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено'
  })
  @ApiOperation({ summary: 'Оновити запис' })
  @UseGuards(AuthAdminGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDAPDto) {
    return this.DAPService.update(id, dto)
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено'
  })
  @ApiOperation({ summary: 'Видалити запис' })
  @UseGuards(AuthAdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.DAPService.delete(id)
  }

  @Post('/translates')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутності успішно створено'
  })
  @ApiOperation({ summary: 'Отримати всі переклади' })
  @ApiBody({
    description: 'Масив перекладів',
    type: DAPCreateTranslateDto,
    isArray: true,
    required: true
  })
  createTranslates(@Body() dto: DAPCreateTranslateDto[]) {
    return this.DAPService.createTranslates(dto)
  }

  @Put(':id/translates')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутності успішно оновлено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  @ApiBody({
    description: 'Масив перекладів',
    type: DAPUpdateTranslateDto,
    isArray: true,
    required: true
  })
  @ApiOperation({ summary: 'Оновити переклади' })
  updateTranslates(@Body() dto: DAPUpdateTranslateDto[]) {
    return this.DAPService.updateTranslates(dto)
  }

  @Delete(':id/translate')
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно видалено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Cутність не знайдено'
  })
  @ApiOperation({ summary: 'Оновити переклади' })
  deleteTranslate(@Param('id', ParseIntPipe) id: number) {
    return this.DAPService.deleteTranslate(id)
  }
}
