import { Controller, UseGuards, Get, Query, Req } from '@nestjs/common'
import { CategoryController } from 'src/category/category.controller'
import { CategoryService } from 'src/category/category.service'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { Request } from 'express'

@UseGuards(AuthAdminGuard)
@Controller('admin/category')
export class AdminCategoryController extends CategoryController {
  constructor(readonly categoryService: CategoryService) {
    super(categoryService)
  }

  @Get()
  find(@Query() { take, skip }: TakeAndSkipDto, @Req() req: Request) {
    return this.categoryService.findAll(take, skip, req.lang)
  }

  @Get('all')
  findAllList(@Req() req: Request) {
    return this.categoryService.findAllList(req.lang)
  }

  @Get('search')
  search(@Query('q') q: string, @Req() req: Request) {
    return this.categoryService.searchByTitle(q, req.lang)
  }
}
