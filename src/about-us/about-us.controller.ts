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
import { AboutUsService } from './about-us.service'
import { CreateAboutUsDto } from './dto/create-about-us.dto'
import { UpdateAboutUsDto } from './dto/update-about-us.dto'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { Request } from 'express'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@ApiTags('Про нас')
@Controller('about-us')
export class AboutUsController {
  constructor(private readonly aboutUsService: AboutUsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано частину сутностей'
  })
  @ApiOperation({ summary: 'Отримати весь контент про нас' })
  findAll(@Query() { take, skip }: TakeAndSkipDto) {
    return this.aboutUsService.findAll(take, skip)
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
  @ApiOperation({ summary: 'Отримати контент про нас' })
  findOne(@Req() req: Request) {
    return this.aboutUsService.findOne(req.lang)
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
  @ApiOperation({ summary: 'Створення контенту про нас' })
  create(@Body() createAboutUsDto: CreateAboutUsDto) {
    return this.aboutUsService.create(createAboutUsDto)
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
  @ApiOperation({ summary: 'Оновити контент про нас' })
  update(@Body() updateAboutUsDto: UpdateAboutUsDto) {
    return this.aboutUsService.update(updateAboutUsDto)
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
  @ApiOperation({ summary: 'Видалити контент про нас' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.aboutUsService.delete(id)
  }
}
