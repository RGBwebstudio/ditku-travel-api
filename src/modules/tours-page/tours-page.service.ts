import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
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
    })

    if (!entity) throw new NotFoundException('tours-page not found')

    return entity
  }

  async update(dto: UpdateToursPageDto): Promise<ToursPage> {
    const { lang } = dto

    if (dto.structure && (dto.structure as any).cta_section) {
      delete (dto.structure as any).cta_section
    }

    const exist = await this.repo.findOne({ where: { lang } })

    if (exist) {
      await this.repo.update({ id: exist.id }, { structure: dto.structure })
      return this.repo.findOne({ where: { id: exist.id } }) as Promise<ToursPage>
    }

    const created = this.repo.create(dto)
    return this.repo.save(created)
  }
}
