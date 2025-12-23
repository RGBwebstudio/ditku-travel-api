import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { City } from 'src/modules/city/entities/city.entity'
import { Product } from 'src/modules/product/entities/product.entity'
import { Repository, DeepPartial } from 'typeorm'

import { CreateRoadmapDto } from './dto/create-roadmap.dto'
import { UpdateRoadmapDto } from './dto/update-roadmap.dto'
import { Roadmap } from './entities/roadmap.entity'

@Injectable()
export class RoadmapService {
  private readonly logger = new Logger(RoadmapService.name)
  constructor(
    @InjectRepository(Roadmap)
    private readonly repo: Repository<Roadmap>
  ) {}

  async findOne(id: number): Promise<Roadmap | null> {
    const entity = await this.repo.findOne({ where: { id } })

    if (!entity) throw new NotFoundException('roadmap is NOT_FOUND')

    return entity
  }
  async findAll(take = 20, skip = 0) {
    const [entities, count] = await this.repo.findAndCount({
      take,
      skip,
      order: { created_at: 'DESC' },
    })

    return { entities, count }
  }

  async create(dto: CreateRoadmapDto): Promise<Roadmap> {
    const payload: DeepPartial<Roadmap> = {
      start_point: dto.start_point,
      end_point: dto.end_point,
      time: dto.time,
      description: dto.description,
      order: dto.order,
    }

    if (typeof dto.city_id !== 'undefined' && dto.city_id !== null) {
      payload.city_id = Object.assign({ id: dto.city_id } as City)
    }

    if (dto.product_id) {
      payload.product_id = Object.assign({ id: dto.product_id } as Product)
    }

    const data = this.repo.create(payload)

    try {
      const saved = await this.repo.save(data)
      return saved
    } catch (err) {
      this.logger.error(`roadmap create error \n`, err)
      throw new BadRequestException('roadmap is NOT_CREATED')
    }
  }

  async update(id: number, dto: UpdateRoadmapDto): Promise<Roadmap | null> {
    const updatePayload: Partial<Roadmap> = {
      start_point: dto.start_point,
      end_point: dto.end_point,
      time: dto.time,
      description: dto.description,
      order: dto.order,
    }

    if (typeof dto.city_id !== 'undefined') {
      if (dto.city_id === null) {
        updatePayload.city_id = null
      } else {
        updatePayload.city_id = Object.assign({ id: dto.city_id } as City)
      }
    }

    if (typeof dto.product_id !== 'undefined') {
      if (dto.product_id === null) {
        updatePayload.product_id = null
      } else {
        updatePayload.product_id = Object.assign({
          id: dto.product_id,
        } as Product)
      }
    }

    const result = await this.repo.update(id, updatePayload)

    if (result.affected === 0) {
      throw new NotFoundException('roadmap is NOT_FOUND')
    }

    return (await this.repo.findOne({ where: { id } })) as Roadmap
  }

  async delete(id: number): Promise<{ message: string }> {
    const result = await this.repo.delete(id)

    if (result.affected === 0) throw new NotFoundException('roadmap is NOT_FOUND')

    return { message: 'SUCCESS' }
  }

  async createFromArray(dtos: CreateRoadmapDto[]): Promise<Roadmap[]> {
    if (!Array.isArray(dtos) || dtos.length === 0) return []

    const payloads: DeepPartial<Roadmap>[] = dtos.map((dto) => {
      const payload: DeepPartial<Roadmap> = {
        start_point: dto.start_point,
        end_point: dto.end_point,
        time: dto.time,
        description: dto.description,
        order: dto.order,
      }

      if (typeof dto.city_id !== 'undefined' && dto.city_id !== null) {
        payload.city_id = Object.assign({ id: dto.city_id } as City)
      }

      if (dto.product_id) {
        payload.product_id = Object.assign({
          id: dto.product_id,
        } as Product)
      }

      return payload
    })

    const entities = this.repo.create(payloads)

    try {
      const saved = await this.repo.save(entities)
      return saved
    } catch (err) {
      this.logger.error('roadmaps create error', err)
      throw new BadRequestException('roadmaps are NOT_CREATED')
    }
  }

  async updateFromArray(items: Array<UpdateRoadmapDto & { id: number }>): Promise<Roadmap[]> {
    if (!Array.isArray(items) || items.length === 0) return []

    const results: Roadmap[] = []

    for (const item of items) {
      const { id, ...dto } = item

      const entity = await this.repo.findOne({ where: { id } })

      if (!entity) throw new NotFoundException(`roadmap id ${id} is NOT_FOUND`)

      if (typeof dto.city_id !== 'undefined') {
        if (dto.city_id === null) {
          entity.city_id = null
        } else {
          entity.city_id = Object.assign({ id: dto.city_id } as City)
        }
      }

      if (typeof dto.product_id !== 'undefined') {
        if (dto.product_id === null) {
          entity.product_id = null
        } else {
          entity.product_id = Object.assign({
            id: dto.product_id,
          } as Product)
        }
      }

      if (typeof dto.start_point !== 'undefined') {
        entity.start_point = dto.start_point
      }

      if (typeof dto.end_point !== 'undefined') {
        entity.end_point = dto.end_point
      }

      if (typeof dto.time !== 'undefined') {
        entity.time = dto.time
      }

      if (typeof dto.description !== 'undefined') {
        entity.description = dto.description
      }

      if (typeof dto.order !== 'undefined') {
        entity.order = dto.order
      }

      try {
        const saved = await this.repo.save(entity)
        results.push(saved)
      } catch (e) {
        this.logger.error(`roadmap update error id=${id}`, (e as Error).stack)
        throw new BadRequestException(`roadmap id ${id} is NOT_UPDATED`)
      }
    }

    return results
  }
}
