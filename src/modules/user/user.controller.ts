import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
  ParseIntPipe,
  Query
} from '@nestjs/common'
import { UserService } from './user.service'
import { UserCreateDto } from './dto/user-create.dto'
import { UserUpdateDto } from './dto/user-update.dto'
import { AuthGuard } from 'src/core/auth/auth.guard'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'
import { Request } from 'express'
import { AuthenticatedRequest } from './types/auth-request.types'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'
import { Roles } from 'src/common/enums/user.enum'

@ApiTags('Користувачі')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('search')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({
    summary: "Пошук користувачів за телефоном, поштою або ім'ям"
  })
  async searchUsers(@Query('q') q: string) {
    if (!q || q.trim() === '') {
      return this.userService.findAll(20, 0)
    }
    return this.userService.searchUsers(q)
  }

  @Get()
  @UseGuards(AuthAdminGuard)
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано всі сутності'
  })
  @ApiOperation({ summary: 'Отримати всіх користувачів' })
  findAll(@Query() { take, skip }: TakeAndSkipDto) {
    return this.userService.findAll(take, skip)
  }

  @Get('data')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано дані сутності'
  })
  @ApiResponse({
    status: 401,
    description: "NOT_AUTHORIZED  - Об'єкт не авторизований"
  })
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Отримати дані користувачів за JWT-токеном' })
  findOne(@Req() req: Request) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new UnauthorizedException('NOT_AUTHORIZED')
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException('NOT_AUTHORIZED')
    }

    return this.userService.findByToken(token)
  }

  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Успішно отримано дані користувача'
  })
  @ApiResponse({
    status: 401,
    description: "NOT_AUTHORIZED  - Об'єкт не авторизований"
  })
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Отримати дані поточного користувача' })
  getCurrentUser(@Req() req: AuthenticatedRequest) {
    return this.userService.findOne(req.user.id)
  }

  @Patch('me')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Дані користувача успішно оновлено'
  })
  @ApiResponse({
    status: 401,
    description: "NOT_AUTHORIZED  - Об'єкт не авторизований"
  })
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Оновити дані поточного користувача' })
  updateCurrentUser(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UserUpdateDto
  ) {
    return this.userService.update(req.user.id, dto)
  }

  @Post()
  @ApiOperation({ summary: 'Створити користувача' })
  @ApiResponse({
    status: 201,
    description: 'CREATED - Сутність успішно створено'
  })
  @ApiResponse({
    status: 400,
    description: 'ALREADY_EXIST - Cутність з такими ключовими даними вже існує'
  })
  @ApiResponse({
    status: 400,
    description: 'NOT_CREATED - Cутність не створено'
  })
  create(@Body() UserDto: UserCreateDto) {
    return this.userService.create(UserDto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити користувача' })
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Сутність успішно оновлено'
  })
  @ApiResponse({
    status: 401,
    description: "NOT_AUTHORIZED  - Об'єкт не авторизований"
  })
  @ApiResponse({
    status: 400,
    description: 'WRONG_CREDENTIALS  - Ключові дані не відповідають сутності'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND  - Сутність не знайдено'
  })
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UserUpdateDto,
    @Req() req: AuthenticatedRequest
  ) {
    if (id !== req.user.id) throw new UnauthorizedException('NOT_AUTHORIZED')

    return this.userService.update(id, dto)
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'SUCCESS - Cутність успішно видалено'
  })
  @ApiResponse({
    status: 401,
    description: "NOT_AUTHORIZED  - Об'єкт не авторизований"
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND  - Сутність не знайдено'
  })
  @UseGuards(AuthAdminGuard)
  @ApiOperation({ summary: 'Видалити користувача' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest
  ) {
    if (req.user.role !== Roles.ADMIN && id !== req.user.id)
      throw new UnauthorizedException('NOT_AUTHORIZED')

    return this.userService.delete(id)
  }
}
