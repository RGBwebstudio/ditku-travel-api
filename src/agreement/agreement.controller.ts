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
  Req,
  UseGuards
} from '@nestjs/common'
import { AgreementService } from './agreement.service'
import { CreateAgreementDto } from './dto/create-agreement.dto'
import { UpdateAgreementDto } from './dto/update-agreement.dto'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { Request } from 'express'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@ApiTags('Terms of use')
@Controller('terms-of-use')
export class AgreementController {
  constructor(private readonly service: AgreementService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей'
  })
  @ApiOperation({ summary: 'Отримати весь контент agreement' })
  findAll(@Query() { take, skip }: TakeAndSkipDto) {
    return this.service.findAll(take, skip)
  }

  @Get(':lang')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно отримано'
  })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Сутність не знайдено' })
  @ApiOperation({ summary: 'Отримати контент agreement' })
  findOne(@Req() req: Request) {
    return this.service.findOne(req.lang)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутність успішно створено'
  })
  @ApiOperation({ summary: 'Створення контенту agreement' })
  create(@Body() dto: CreateAgreementDto) {
    return this.service.create(dto)
  }

  @Patch()
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Оновити контент agreement' })
  update(@Body() dto: UpdateAgreementDto) {
    return this.service.update(dto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Видалити контент agreement' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id)
  }
}
