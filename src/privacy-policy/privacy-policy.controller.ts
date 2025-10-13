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
import { PrivacyPolicyService } from './privacy-policy.service'
import { CreatePrivacyPolicyDto } from './dto/create-privacy-policy.dto'
import { UpdatePrivacyPolicyDto } from './dto/update-privacy-policy.dto'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { Request } from 'express'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@ApiTags('Private Policy')
@Controller('privacy-policy')
export class PrivacyPolicyController {
  constructor(private readonly service: PrivacyPolicyService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей'
  })
  @ApiOperation({ summary: 'Отримати весь контент privacy policy' })
  findAll(@Query() { take, skip }: TakeAndSkipDto) {
    return this.service.findAll(take, skip)
  }

  @Get(':lang')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно отримано'
  })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - Сутність не знайдено' })
  @ApiOperation({ summary: 'Отримати контент privacy policy' })
  findOne(@Req() req: Request) {
    return this.service.findOne(req.lang)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутність успішно створено'
  })
  @ApiOperation({ summary: 'Створення контенту privacy policy' })
  create(@Body() dto: CreatePrivacyPolicyDto) {
    return this.service.create(dto)
  }

  @Patch()
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Оновити контент privacy policy' })
  update(@Body() dto: UpdatePrivacyPolicyDto) {
    return this.service.update(dto)
  }

  @Delete(':id')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Видалити контент privacy policy' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id)
  }
}
