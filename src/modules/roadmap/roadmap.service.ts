import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { City } from 'src/modules/city/entities/city.entity'
import { Product } from 'src/modules/product/entities/product.entity'
import { Repository, DeepPartial } from 'typeorm'

import { CreateRoadmapDto } from './dto/create-roadmap.dto'
import { RoadmapCreateTranslateDto } from './dto/roadmap-create-translate.dto'
import { RoadmapUpdateTranslateDto } from './dto/roadmap-update-translate.dto'
import { UpdateRoadmapDto } from './dto/update-roadmap.dto'
import { RoadmapTranslate } from './entities/roadmap-translate.entity'
import { Roadmap } from './entities/roadmap.entity'

@Injectable()
export class RoadmapService {
  private readonly logger = new Logger(RoadmapService.name)
  constructor(
    @InjectRepository(Roadmap)
    private readonly repo: Repository<Roadmap>,
    @InjectRepository(RoadmapTranslate)
    private readonly repoTranslate: Repository<RoadmapTranslate>
  ) {}

  async findOne(id: number, lang: LANG = LANG.UA): Promise<Roadmap | null> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['translates'],
    })

    if (!entity) throw new NotFoundException('roadmap is NOT_FOUND')

    return applyTranslations([entity], lang)[0]
  }
  async findAll(take = 20, skip = 0, lang: LANG = LANG.UA) {
    const [entities, count] = await this.repo.findAndCount({
      take,
      skip,
      relations: ['translates'],
      order: { created_at: 'DESC' },
    })

    return { entities: applyTranslations(entities, lang), count }
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

      // Handle flattened translations
      const translations: RoadmapCreateTranslateDto[] = []
      const langFields = ['description']

      const payloadDto: any = dto

      for (const field of langFields) {
        if (payloadDto[`${field}_ua`]) {
          translations.push({
            entity_id: saved,
            lang: LANG.UA,
            field: field,
            value: payloadDto[`${field}_ua`],
          })
        }
        if (payloadDto[`${field}_en`]) {
          translations.push({
            entity_id: saved,
            lang: LANG.EN,
            field: field,
            value: payloadDto[`${field}_en`],
          })
        }
      }

      if (translations.length > 0) {
        await this.createTranslates(translations)
      }

      return (await this.findOne(saved.id)) as Roadmap
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

    const existingEntity = await this.repo.findOne({
      where: { id },
      relations: ['translates'],
    })

    // Handle flattened translations
    if (existingEntity) {
      const langFields = ['description']
      const payloadDto: any = dto

      for (const field of langFields) {
        // Handle UA
        if (payloadDto[`${field}_ua`]) {
          await this.repoTranslate.delete({
            entity_id: { id: existingEntity.id },
            lang: LANG.UA,
            field: field,
          })

          await this.repoTranslate.save({
            entity_id: existingEntity,
            lang: LANG.UA,
            field: field,
            value: payloadDto[`${field}_ua`],
          })
        }
        // Handle EN
        if (payloadDto[`${field}_en`]) {
          await this.repoTranslate.delete({
            entity_id: { id: existingEntity.id },
            lang: LANG.EN,
            field: field,
          })

          await this.repoTranslate.save({
            entity_id: existingEntity,
            lang: LANG.EN,
            field: field,
            value: payloadDto[`${field}_en`],
          })
        }
      }
    }

    return (await this.findOne(id)) as Roadmap
  }

  async delete(id: number): Promise<{ message: string }> {
    const result = await this.repo.delete(id)

    if (result.affected === 0) throw new NotFoundException('roadmap is NOT_FOUND')

    return { message: 'SUCCESS' }
  }

  async createFromArray(dtos: CreateRoadmapDto[]): Promise<Roadmap[]> {
    if (!Array.isArray(dtos) || dtos.length === 0) return []

    const results: Roadmap[] = []

    for (const dto of dtos) {
      try {
        const saved = await this.create(dto)
        results.push(saved)
      } catch (err) {
        this.logger.error('roadmaps create error', err)
        throw new BadRequestException('roadmaps are NOT_CREATED')
      }
    }

    return results
  }

  async updateFromArray(items: Array<UpdateRoadmapDto & { id: number }>): Promise<Roadmap[]> {
    if (!Array.isArray(items) || items.length === 0) return []

    const results: Roadmap[] = []

    for (const item of items) {
      // Just call individual update to reuse logic
      const { id, ...dto } = item

      // Note: update method handles partial updates and translations
      // However, the original implementation had manual property checks.
      // Let's defer to valid update call structure if possible, but the original implementation did property checks manually.
      // To support translations in array update, calling this.update(id, dto) is safest if we trust it.
      // But wait, the original updateFromArray does manual mapping. Let's stick to doing it manually but adding translation support.
      // Actually, calling this.update() inside the loop is cleaner and safer to maintain.
      // Only difference is createDate/updateDate handling and error aggregation.

      // Let's refactor to iterate and call update() which now handles translations.
      // Beware: `update` throws if not found.
      try {
        const updated = await this.update(id, dto)
        if (updated) results.push(updated)
      } catch (e) {
        this.logger.error(`roadmap update error id=${id}`, (e as Error).stack)
        // We might want to continue or throw? Original code threw BadRequest.
        throw new BadRequestException(`roadmap id ${id} is NOT_UPDATED`)
      }
    }

    return results
  }

  async createTranslates(dto: RoadmapCreateTranslateDto[]): Promise<RoadmapTranslate[] | null> {
    if (dto?.length) {
      const results: RoadmapTranslate[] = []

      for (const translate of dto) {
        const data = this.repoTranslate.create(translate)
        const result = await this.repoTranslate.save(data)
        results.push(result)
      }

      return results
    }
    return null
  }

  async updateTranslates(dto: RoadmapUpdateTranslateDto[]): Promise<RoadmapTranslate[] | null> {
    const results: RoadmapTranslate[] = []

    for (const translate of dto) {
      const result = await this.repoTranslate.update(translate.id, {
        ...translate,
      })

      if (result.affected === 0) throw new NotFoundException('roadmap translate is NOT_FOUND')

      const updatedEntityTranslate = await this.repoTranslate.findOne({
        where: { id: translate.id },
      })

      if (updatedEntityTranslate) results.push(updatedEntityTranslate)
    }

    return results
  }

  async deleteTranslate(id: number): Promise<{ message: string } | NotFoundException> {
    const result = await this.repoTranslate.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException('roadmap translate is NOT_FOUND')
    }

    return { message: 'OK' }
  }
}
