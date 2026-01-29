import { Body, Controller, Get, Param, Patch } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { LANG } from 'src/common/enums/translation.enum'

import { UpdateToursPageDto } from './dto/update-tours-page.dto'
import { ToursPageService } from './tours-page.service'

@ApiTags('Tours Page')
@Controller('admin/tours-page')
export class ToursPageController {
  constructor(private readonly service: ToursPageService) {}

  @Get(':lang')
  get(@Param('lang') lang: LANG) {
    return this.service.get(lang)
  }

  @Get('category-items/:lang')
  getCategoryItems(@Param('lang') lang: LANG) {
    return this.service.getCategoryItems(lang)
  }

  @Patch()
  update(@Body() dto: UpdateToursPageDto) {
    return this.service.update(dto)
  }
}
