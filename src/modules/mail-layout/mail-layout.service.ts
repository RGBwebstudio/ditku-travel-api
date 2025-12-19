import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MailLayout } from './entities/mail-layout.entity'
import { Repository } from 'typeorm'
import { CreateMailLayoutDto } from './dto/create-mail-layout.dto'
import { UpdateMailLayoutDto } from './dto/update-mail-layout.dto'

@Injectable()
export class MailLayoutService {
  constructor(
    @InjectRepository(MailLayout) private mailLayout: Repository<MailLayout>
  ) {}

  async findAll(take: number, skip: number) {
    const [entities, count] = await this.mailLayout.findAndCount({
      take,
      skip,
      order: { created_at: 'DESC' }
    })
    return { entities, count }
  }

  async findOne(id: number) {
    const entity = await this.mailLayout.findOne({ where: { id } })

    if (!entity) throw new NotFoundException('mail-layout is NOT_FOUND')

    return entity
  }

  async create(dto: CreateMailLayoutDto): Promise<MailLayout> {
    const exists = await this.mailLayout
      .createQueryBuilder('mailLayout')
      .where('LOWER(mailLayout.title) = :title', {
        title: (dto.title || '').toLowerCase()
      })
      .getOne()

    if (exists) {
      throw new BadRequestException('NAME_ALREADY_RESERVED')
    }

    const data = this.mailLayout.create(dto)
    return await this.mailLayout.save(data)
  }

  async update(id: number, dto: UpdateMailLayoutDto): Promise<MailLayout> {
    const mailLayout = await this.mailLayout.findOne({ where: { id } })

    if (!mailLayout) throw new NotFoundException('mail-layout is NOT_FOUND')

    if (dto.title) {
      const exists = await this.mailLayout
        .createQueryBuilder('mailLayout')
        .where('LOWER(mailLayout.title) = :title', {
          title: dto.title.toLowerCase()
        })
        .andWhere('mailLayout.id != :id', { id })
        .getOne()

      if (exists) {
        throw new BadRequestException('NAME_ALREADY_RESERVED')
      }
    }

    const body = { ...mailLayout, ...dto }
    return await this.mailLayout.save(body)
  }

  async delete(id: number): Promise<void> {
    const result = await this.mailLayout.delete(id)

    if (result.affected === 0)
      throw new NotFoundException('mail-layout is NOT_FOUND')
  }
}
