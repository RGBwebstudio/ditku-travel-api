import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { compareSync, genSaltSync, hashSync } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { UserCreateDto } from 'src/user/dto/user-create.dto'
import { User } from 'src/user/entities/user.entity'
import { PhoneRegisterDto } from './dto/phone-register.dto'
import { PhoneLoginDto } from './dto/phone-login.dto'
import { PhoneVerifyCodeDto } from './dto/phone-verify-code.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CartService } from 'src/cart/cart.service'
import { SetPasswordDto } from './dto/set-password.dto'

@Injectable()
export class AuthSevice {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
    private cartService: CartService
  ) {}

  async signIn(
    email: string,
    pass: string,
    session_id: string
  ): Promise<{ user: User; access_token: string }> {
    const user = await this.userService.findByEmail(email)

    if (!user)
      throw new NotFoundException('user with this credentials NOT_FOUND')

    const isPasswordCorrect = compareSync(pass, user.password)

    if (!user || !isPasswordCorrect)
      throw new BadRequestException('WRONG_CREDENTIALS')

    const payload = { id: user.id, role: user.role }
    const access_token = await this.jwtService.signAsync(payload)

    await this.cartService.updateUserOfCart({ session_id, user_id: user.id })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user

    return {
      access_token,
      user: userWithoutPassword as User
    }
  }

  async signUp(dto: UserCreateDto): Promise<User> {
    const isUserExist = await this.userRepo.findOne({
      where: { email: dto.email }
    })

    if (isUserExist)
      throw new BadRequestException('user with this credentials ALREADY_EXIST')

    const newUser = this.userRepo.create(dto)
    return await this.userRepo.save(newUser)
  }

  async phoneRegister(phoneRegisterDto: PhoneRegisterDto) {
    const existingUser = await this.userService.findByPhone(
      phoneRegisterDto.phone
    )

    if (existingUser) {
      throw new UnauthorizedException(
        'Користувач з таким номером телефону вже існує'
      )
    }

    await this.userService.createByPhone(phoneRegisterDto.phone)

    return {
      message:
        'Користувач створений. Код підтвердження відправлено на ваш номер телефону',
      success: true
    }
  }

  async phoneLogin(phoneLoginDto: PhoneLoginDto) {
    let user = await this.userService.findByPhone(phoneLoginDto.phone)

    if (!user) {
      user = await this.userService.createByPhone(phoneLoginDto.phone)
    }

    return {
      message: 'Код підтвердження відправлено на ваш номер телефону',
      success: true
    }
  }

  async phoneVerifyCode(
    phoneVerifyCodeDto: PhoneVerifyCodeDto,
    session_id?: string
  ) {
    const user = await this.userService.findByPhone(phoneVerifyCodeDto.phone)

    if (!user) {
      throw new UnauthorizedException('WRONG_CREDENTIALS')
    }

    if (phoneVerifyCodeDto.code !== '000000') {
      throw new UnauthorizedException('Невірний код підтвердження')
    }

    const payload = { id: user.id, role: user.role }
    const access_token = await this.jwtService.signAsync(payload)

    if (session_id) {
      await this.cartService.updateUserOfCart({ session_id, user_id: user.id })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user

    return {
      access_token,
      user: userWithoutPassword as User
    }
  }

  async setPassword(
    dto: SetPasswordDto
  ): Promise<{ message: string; success: boolean }> {
    const user = await this.userRepo.findOne({
      where: { email: dto.email }
    })

    if (!user) {
      throw new NotFoundException('Користувача не знайдено')
    }

    const salt = genSaltSync(10)
    const hashedPassword = hashSync(dto.password, salt)

    await this.userRepo.update(
      { email: dto.email },
      { password: hashedPassword }
    )

    return {
      message: 'Пароль користувача успішно змінено',
      success: true
    }
  }
}
