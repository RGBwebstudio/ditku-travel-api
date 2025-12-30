import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'

import { MailSenderService } from 'src/modules/mail-sender/mail-sender.service'
import { In, Repository } from 'typeorm'

import { UserCreateDto } from './dto/user-create.dto'
import { UserUpdateDto } from './dto/user-update.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name)
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @Inject(forwardRef(() => MailSenderService))
    private mailService: MailSenderService,
    private jwtService: JwtService
  ) {}

  async searchUsers(q: string): Promise<{ entities: User[]; count: number }> {
    const qb = this.userRepo.createQueryBuilder('user')
    qb.where('user.phone LIKE :q', { q: `%${q}%` })
      .orWhere('user.first_name LIKE :q', { q: `%${q}%` })
      .orWhere('user.second_name LIKE :q', { q: `%${q}%` })
      .orWhere('user.email LIKE :q', { q: `%${q}%` })
      .orderBy('user.created_at', 'DESC')
      .limit(20)
    const [entities, count] = await qb.getManyAndCount()
    return { entities, count }
  }

  async findAll(take: number, skip: number): Promise<{ entities: User[]; count: number }> {
    const entities = await this.userRepo.find({
      take,
      skip,
      order: { created_at: 'DESC' },
      relations: ['address_list'],
    })
    const count = await this.userRepo.count()

    return { entities, count }
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['address_list'],
    })

    if (!user) throw new NotFoundException('user is NOT_FOUND')

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOne({ where: { email } })
  }

  async findByEmails(emails: string[]): Promise<User[]> {
    const users = await this.userRepo.find({
      where: {
        email: In(emails),
      },
    })

    return users
  }

  async findByToken(token: string): Promise<User> {
    try {
      const payload = await this.jwtService.verifyAsync<{ id: number }>(token, {
        secret: process.env.JWT_SECRET,
      })

      const userId = payload.id

      const result = await this.userRepo.findOne({
        where: { id: userId },
        relations: ['address_list'],
      })

      if (!result) {
        throw new UnauthorizedException('user is NOT_AUTHORIZED')
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userData } = result

      return userData as User
    } catch {
      throw new UnauthorizedException('user is NOT_AUTHORIZED')
    }
  }

  async create(dto: UserCreateDto): Promise<User> {
    const isUserExist = await this.userRepo.find({
      where: { email: dto.email },
    })

    if (isUserExist) throw new BadRequestException('user is ALREADY_EXIST')

    const newUser = this.userRepo.create(dto)

    try {
      return await this.userRepo.save(newUser)
    } catch (e) {
      console.error('Error creating user:', e)
      throw new BadRequestException('user is NOT_CREATED')
    }
  }

  async update(id: number, dto: UserUpdateDto): Promise<User> {
    const existingUser = await this.userRepo.findOne({ where: { id } })
    if (!existingUser) throw new NotFoundException('user is NOT_FOUND')

    if (dto.phone && dto.phone !== existingUser.phone) {
      const userWithSamePhone = await this.userRepo.findOne({
        where: { phone: dto.phone },
      })
      if (userWithSamePhone && userWithSamePhone.id !== id) {
        throw new BadRequestException('Phone number already in use')
      }
    }

    const updatedUser = this.userRepo.merge(existingUser, dto)

    await this.userRepo.save(updatedUser)

    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['address_list'],
    })

    if (!user) throw new NotFoundException('user is NOT_FOUND')

    return user
  }

  async delete(id: number): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { id } })
    if (!user) throw new NotFoundException('user is NOT_FOUND')

    const result = await this.userRepo.delete(id)
    if (result.affected === 0) throw new NotFoundException('user is NOT_FOUND')

    return { message: 'SUCCESS' }
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { phone },
      relations: ['address_list'],
    })
  }

  async createByPhone(phone: string): Promise<User> {
    const user = new User()
    user.phone = phone
    user.first_name = ''
    user.second_name = ''
    user.middle_name = ''
    user.birth_date = new Date()
    user.email = ''
    user.password = ''
    return this.userRepo.save(user)
  }
}
