import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthSevice } from './auth.service'
import { UserCreateDto } from 'src/modules/user/dto/user-create.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SignInDto } from './dto/sign-in.dto'
import { SetPasswordDto } from './dto/set-password.dto'
import { AuthAdminGuard } from './auth-admin.guard'

@ApiTags('Авторизація')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthSevice) {}

  @Post('sign-in')
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - користувач успішно авторизований'
  })
  @ApiResponse({
    status: 400,
    description: 'WRONG_CREDENTIALS - передані дані невірні'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - користувача не знайдено'
  })
  @ApiOperation({ summary: 'Вхід' })
  signIn(@Body() dto: SignInDto) {
    const { email, password } = dto
    return this.authService.signIn(email, password)
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Реєстрація' })
  signUp(@Body() dto: UserCreateDto) {
    return this.authService.signUp(dto)
  }

  @Post('set-password')
  @UseGuards(AuthAdminGuard)
  @ApiOperation({
    summary: 'Встановлення пароля користувачу (тільки для адміністраторів)'
  })
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - пароль успішно змінено'
  })
  @ApiResponse({
    status: 401,
    description: 'UNAUTHORIZED - недостатньо прав доступу'
  })
  @ApiResponse({
    status: 404,
    description: 'NOT_FOUND - користувача не знайдено'
  })
  setPassword(@Body() dto: SetPasswordDto) {
    return this.authService.setPassword(dto)
  }
}
