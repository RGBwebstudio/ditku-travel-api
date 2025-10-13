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
import { ContactsService } from './contacts.service'
import { CreateContactsDto } from './dto/create-contacts.dto'
import { UpdateContactsDto } from './dto/update-contacts.dto'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { Request } from 'express'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@ApiTags('Контакти')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly сontactsService: ContactsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей'
  })
  @ApiOperation({ summary: 'Отримати всі контакти' })
  findAll(@Query() { take, skip }: TakeAndSkipDto) {
    return this.сontactsService.findAll(take, skip)
  }

  @Get(':lang')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно отримано'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено'
  })
  @ApiOperation({ summary: 'Отримати контент контактів' })
  findOne(@Req() req: Request) {
    return this.сontactsService.findOne(req.lang)
  }

  @Post()
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - Сутність успішно створено'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Cутність не створено'
  })
  @ApiOperation({ summary: 'Створення контенту контактів' })
  create(@Body() createAboutUsDto: CreateContactsDto) {
    return this.сontactsService.create(createAboutUsDto)
  }

  @Patch()
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - Сутність не знайдено'
  })
  @ApiOperation({ summary: 'Оновити контент контактів' })
  update(@Body() updateAboutUsDto: UpdateContactsDto) {
    return this.сontactsService.update(updateAboutUsDto)
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
  @ApiOperation({ summary: 'Видалити контент контактів' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.сontactsService.delete(id)
  }
}
