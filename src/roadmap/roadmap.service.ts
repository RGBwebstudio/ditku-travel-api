import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DeepPartial } from 'typeorm'
import { Roadmap } from './entities/roadmap.entity'
import { CreateRoadmapDto } from './dto/create-roadmap.dto'
import { UpdateRoadmapDto } from './dto/update-roadmap.dto'
import { Product } from 'src/product/entities/product.entity'
import { City } from 'src/city/entities/city.entity'

@Injectable()
export class RoadmapService {
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
      order: { created_at: 'DESC' }
    })

    return { entities, count }
  }

  async create(dto: CreateRoadmapDto): Promise<Roadmap> {
    const payload: DeepPartial<Roadmap> = {
      start_point: dto.start_point,
      end_point: dto.end_point,
      time: dto.time,
      description: dto.description,
      order: dto.order
    }

    if (typeof dto.city_id !== 'undefined' && dto.city_id !== null) {
      payload.city_id = { id: dto.city_id } as unknown as City
    }

    if (dto.product_id) {
      payload.product_id = { id: dto.product_id } as unknown as Product
    }

    const data = this.repo.create(payload)

    try {
      const saved = (await this.repo.save(data)) as unknown as Roadmap
      return saved
    } catch {
      throw new BadRequestException('roadmap is NOT_CREATED')
    }
  }

  async update(id: number, dto: UpdateRoadmapDto): Promise<Roadmap | null> {
    const updatePayload: Partial<Roadmap> = {
      start_point: dto.start_point,
      end_point: dto.end_point,
      time: dto.time,
      description: dto.description,
      order: dto.order
    }

    if (typeof dto.city_id !== 'undefined') {
      updatePayload.city_id =
        dto.city_id === null
          ? (null as unknown as City)
          : ({ id: dto.city_id } as City)
    }

    if (typeof dto.product_id !== 'undefined') {
      updatePayload.product_id = { id: dto.product_id } as Product
    }

    const result = await this.repo.update(id, updatePayload)

    if (result.affected === 0) {
      throw new NotFoundException('roadmap is NOT_FOUND')
    }

    return (await this.repo.findOne({ where: { id } })) as Roadmap
  }

  async delete(id: number): Promise<{ message: string }> {
    const result = await this.repo.delete(id)

    if (result.affected === 0)
      throw new NotFoundException('roadmap is NOT_FOUND')

    return { message: 'SUCCESS' }
  }
}
