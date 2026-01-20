import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { Product } from 'src/modules/product/entities/product.entity'
import { Repository } from 'typeorm'

import { UpdateToursPageDto } from './dto/update-tours-page.dto'
import { ToursPage } from './entities/tours-page.entity'

@Injectable()
export class ToursPageService {
  private readonly logger = new Logger(ToursPageService.name)

  constructor(
    @InjectRepository(ToursPage)
    private readonly repo: Repository<ToursPage>
  ) {}

  async get(lang: LANG): Promise<ToursPage> {
    const entity = await this.repo.findOne({
      where: { lang },
      relations: ['popular_tours', 'popular_tours.category_id'],
    })

    if (!entity) throw new NotFoundException('tours-page not found')

    return entity
  }

  async update(dto: UpdateToursPageDto): Promise<ToursPage> {
    const { lang } = dto

    if (dto.structure && 'cta_section' in dto.structure) {
      delete (dto.structure as Record<string, unknown>).cta_section
    }

    const exist = await this.repo.findOne({ where: { lang } })

    if (exist) {
      await this.repo.update({ id: exist.id }, { structure: dto.structure })

      if (dto.popular_tours_ids !== undefined) {
        const entity = await this.repo.findOne({ where: { id: exist.id }, relations: ['popular_tours'] })
        if (entity) {
          entity.popular_tours = dto.popular_tours_ids.map((id) => ({ id }) as Product)
          await this.repo.save(entity)
        }
      }

      return this.repo.findOne({
        where: { id: exist.id },
        relations: ['popular_tours', 'popular_tours.category_id'],
      }) as Promise<ToursPage>
    }

    const created = this.repo.create({
      ...dto,
      popular_tours: dto.popular_tours_ids ? dto.popular_tours_ids.map((id) => ({ id }) as Product) : [],
    })
    return this.repo.save(created)
  }
}
