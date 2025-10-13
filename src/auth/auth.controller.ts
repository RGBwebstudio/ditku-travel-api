import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { AuthSevice } from './auth.service'
import { UserCreateDto } from 'src/user/dto/user-create.dto'
import { PhoneRegisterDto } from './dto/phone-register.dto'
import { PhoneLoginDto } from './dto/phone-login.dto'
import { PhoneVerifyCodeDto } from './dto/phone-verify-code.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SignInDto } from './dto/sign-in.dto'
import { SetPasswordDto } from './dto/set-password.dto'
import { AuthAdminGuard } from './auth-admin.guard'
import { Request } from 'express'

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
  signIn(@Body() dto: SignInDto, @Req() req: Request) {
    const { email, password } = dto
    return this.authService.signIn(email, password, req.sessionID)
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Реєстрація' })
  signUp(@Body() dto: UserCreateDto) {
    return this.authService.signUp(dto)
  }

  @Post('phone/register')
  @ApiOperation({
    summary: 'Перший етап реєстрації - введення номера телефону'
  })
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - користувач створений, код підтвердження відправлено'
  })
  @ApiResponse({
    status: 401,
    description: 'UNAUTHORIZED - користувач з таким номером вже існує'
  })
  phoneRegister(@Body() dto: PhoneRegisterDto) {
    return this.authService.phoneRegister(dto)
  }

  @Post('phone/login')
  @ApiOperation({
    summary: 'Перший етап авторизації - введення номера телефону'
  })
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - код підтвердження відправлено'
  })
  @ApiResponse({
    status: 401,
    description: 'UNAUTHORIZED - користувача не знайдено'
  })
  phoneLogin(@Body() dto: PhoneLoginDto) {
    return this.authService.phoneLogin(dto)
  }

  @Post('phone/verify-code')
  @ApiOperation({
    summary: 'Другий етап авторизації/реєстрації - підтвердження коду'
  })
  @ApiResponse({
    status: 201,
    description: 'SUCCESS - користувач успішно авторизований'
  })
  @ApiResponse({
    status: 401,
    description: 'UNAUTHORIZED - невірний код або номер телефону'
  })
  phoneVerifyCode(@Body() dto: PhoneVerifyCodeDto, @Req() req: Request) {
    return this.authService.phoneVerifyCode(dto, req.sessionID)
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
