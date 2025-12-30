import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { CreatePromocodeDto } from './dto/create-promocode.dto'
import { UpdatePromocodeDto } from './dto/update-promocode.dto'
import { Promocode } from './entities/promocode.entity'

@Injectable()
export class PromocodeService {
  private readonly logger = new Logger(PromocodeService.name)

  constructor(
    @InjectRepository(Promocode)
    private readonly repo: Repository<Promocode>
  ) {}

  async create(dto: CreatePromocodeDto): Promise<Promocode> {
    const entity = this.repo.create(dto)
    try {
      return await this.repo.save(entity)
    } catch (err) {
      this.logger.error(`Error creating promocode: ${err}`)
      throw new BadRequestException('promocode is NOT_CREATED')
    }
  }

  async findAll(take: number, skip: number): Promise<{ entities: Promocode[]; count: number }> {
    const entities = await this.repo.find({
      take,
      skip,
      order: { created_at: 'DESC' },
    })
    const count = await this.repo.count()
    return { entities, count }
  }

  async findOne(id: number): Promise<Promocode> {
    const entity = await this.repo.findOne({ where: { id } })
    if (!entity) throw new NotFoundException('promocode is NOT_FOUND')
    return entity
  }

  async update(id: number, dto: UpdatePromocodeDto): Promise<Promocode> {
    const existing = await this.repo.findOne({ where: { id } })
    if (!existing) throw new NotFoundException('promocode is NOT_FOUND')

    if (dto.title !== undefined) existing.title = dto.title
    if (dto.discount !== undefined) existing.discount = dto.discount

    try {
      await this.repo.save(existing)
    } catch (err) {
      this.logger.error(`Error updating promocode: ${err}`)
      throw new BadRequestException('promocode is NOT_UPDATED')
    }

    return await this.findOne(id)
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.repo.delete(id)
      if (result.affected === 0) throw new NotFoundException('promocode is NOT_FOUND')
    } catch (err) {
      this.logger.error(`Error while deleting promocode: ${err}`)
      throw err
    }
    return { message: 'SUCCESS' }
  }
}
