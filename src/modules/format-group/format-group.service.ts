import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { FormatGroupCreateDto } from './dto/format-group-create.dto'
import { FormatGroupUpdateDto } from './dto/format-group-update.dto'
import { FormatGroup } from './entities/format-group.entity'

@Injectable()
export class FormatGroupService {
  private readonly logger = new Logger(FormatGroupService.name)

  constructor(
    @InjectRepository(FormatGroup)
    private readonly repo: Repository<FormatGroup>
  ) {}

  async find(take = 20, skip = 0) {
    const [entities, count] = await this.repo.findAndCount({
      take,
      skip,
      order: { created_at: 'DESC' },
    })
    return { entities, count }
  }

  async searchByTitle(query: string) {
    if (!query || query.trim().length === 0) return { entities: [] }

    const result = await this.repo
      .createQueryBuilder('fg')
      .where('LOWER(fg.title) LIKE :title', {
        title: `%${query.toLowerCase()}%`,
      })
      .orderBy('fg.created_at', 'DESC')
      .take(20)
      .getMany()

    return { entities: result }
  }

  async findAll() {
    const entities = await this.repo.find({ order: { created_at: 'DESC' } })
    return { entities }
  }

  async findOne(id: number): Promise<FormatGroup | null> {
    const entity = await this.repo.findOne({ where: { id } })
    if (!entity) throw new NotFoundException('format_group is NOT_FOUND')
    return entity
  }

  async create(dto: FormatGroupCreateDto): Promise<FormatGroup> {
    const exists = await this.repo
      .createQueryBuilder('fg')
      .where('LOWER(fg.title) = :title', {
        title: String(dto.title).toLowerCase(),
      })
      .getOne()

    if (exists) {
      throw new BadRequestException('ALREADY_CREATED')
    }

    const data = this.repo.create(dto)
    try {
      const saved = await this.repo.save(data)
      return saved
    } catch (err) {
      this.logger.error(`Error while creating format_group: ${err}`)
      throw new BadRequestException('format_group is NOT_CREATED')
    }
  }

  async update(id: number, dto: FormatGroupUpdateDto): Promise<FormatGroup> {
    const exists = await this.repo.findOne({ where: { id } })
    if (!exists) throw new NotFoundException('format_group is NOT_FOUND')

    try {
      await this.repo.update(id, { ...dto })
    } catch (err) {
      this.logger.error(`Error while updating format_group: ${err}`)
      throw new BadRequestException('format_group is NOT_UPDATED')
    }

    return (await this.repo.findOne({ where: { id } })) as FormatGroup
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.repo.delete(id)
      if (result.affected === 0) throw new NotFoundException('format_group is NOT_FOUND')
    } catch (err) {
      this.logger.error(`Error while deleting format_group: ${err}`)
      throw err
    }

    return { message: 'SUCCESS' }
  }
}
