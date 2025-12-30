import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'

import { compareSync, genSaltSync, hashSync } from 'bcrypt'
import { UserCreateDto } from 'src/modules/user/dto/user-create.dto'
import { User } from 'src/modules/user/entities/user.entity'
import { UserService } from 'src/modules/user/user.service'
import { Repository } from 'typeorm'

import { SetPasswordDto } from './dto/set-password.dto'

@Injectable()
export class AuthSevice {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, pass: string): Promise<{ user: User; access_token: string }> {
    const user = await this.userService.findByEmail(email)

    if (!user) throw new NotFoundException('user with this credentials NOT_FOUND')

    const isPasswordCorrect = compareSync(pass, user.password)

    if (!user || !isPasswordCorrect) throw new BadRequestException('WRONG_CREDENTIALS')

    const payload = { id: user.id, role: user.role }
    const access_token = await this.jwtService.signAsync(payload)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user

    return {
      access_token,
      user: userWithoutPassword as User,
    }
  }

  async signUp(dto: UserCreateDto): Promise<User> {
    const isUserExist = await this.userRepo.findOne({
      where: { email: dto.email },
    })

    if (isUserExist) throw new BadRequestException('user with this credentials ALREADY_EXIST')

    const newUser = this.userRepo.create(dto)
    return await this.userRepo.save(newUser)
  }

  async setPassword(dto: SetPasswordDto): Promise<{ message: string; success: boolean }> {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    })

    if (!user) {
      throw new NotFoundException('Користувача не знайдено')
    }

    const salt = genSaltSync(10)
    const hashedPassword = hashSync(dto.password, salt)

    await this.userRepo.update({ email: dto.email }, { password: hashedPassword })

    return {
      message: 'Пароль користувача успішно змінено',
      success: true,
    }
  }
}
