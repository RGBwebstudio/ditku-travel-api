import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { Repository } from 'typeorm'

import { FormatGroupCreateDto } from './dto/format-group-create.dto'
import { FormatGroupUpdateDto } from './dto/format-group-update.dto'
import { FormatGroupTranslate } from './entities/format-group-translate.entity'
import { FormatGroup } from './entities/format-group.entity'

@Injectable()
export class FormatGroupService {
  private readonly logger = new Logger(FormatGroupService.name)

  constructor(
    @InjectRepository(FormatGroup)
    private readonly repo: Repository<FormatGroup>,
    @InjectRepository(FormatGroupTranslate)
    private readonly translateRepo: Repository<FormatGroupTranslate>
  ) {}

  async find(take = 20, skip = 0, lang: LANG) {
    const [entities, count] = await this.repo.findAndCount({
      take,
      skip,
      relations: ['translates'],
      order: { created_at: 'DESC' },
    })

    const mappedEntities = applyTranslations(entities, lang)

    return { entities: mappedEntities, count }
  }

  async searchByTitle(query: string, lang: LANG) {
    if (!query || query.trim().length === 0) return { entities: [] }

    const result = await this.repo
      .createQueryBuilder('fg')
      .leftJoinAndSelect('fg.translates', 'translates')
      .where('LOWER(fg.title) LIKE :title', {
        title: `%${query.toLowerCase()}%`,
      })
      .orderBy('fg.created_at', 'DESC')
      .take(20)
      .getMany()

    const mappedEntities = applyTranslations(result, lang)

    return { entities: mappedEntities }
  }

  async findAll(lang: LANG) {
    const entities = await this.repo.find({ relations: ['translates'], order: { created_at: 'DESC' } })
    const mappedEntities = applyTranslations(entities, lang)
    return { entities: mappedEntities }
  }

  async findOne(id: number): Promise<FormatGroup> {
    const entity = await this.repo.findOne({ where: { id }, relations: ['translates'] })
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

    const { title_ua, title_en, ...rest } = dto

    const data = this.repo.create(rest)
    try {
      const saved = await this.repo.save(data)

      if (title_ua) {
        await this.translateRepo.save({
          entity_id: saved,
          lang: LANG.UA,
          field: 'title',
          value: title_ua,
        })
      }

      if (title_en) {
        await this.translateRepo.save({
          entity_id: saved,
          lang: LANG.EN,
          field: 'title',
          value: title_en,
        })
      }

      return this.findOne(saved.id)
    } catch (err) {
      this.logger.error(`Error while creating format_group: ${err}`)
      throw new BadRequestException('format_group is NOT_CREATED')
    }
  }

  async update(id: number, dto: FormatGroupUpdateDto): Promise<FormatGroup> {
    const exists = await this.repo.findOne({ where: { id } })
    if (!exists) throw new NotFoundException('format_group is NOT_FOUND')

    const { title_ua, title_en, ...rest } = dto

    try {
      await this.repo.update(id, { ...rest })

      if (title_ua) {
        const existing = await this.translateRepo.findOne({
          where: { entity_id: { id }, lang: LANG.UA, field: 'title' },
        })
        if (existing) {
          await this.translateRepo.update(existing.id, { value: title_ua })
        } else {
          await this.translateRepo.save({
            entity_id: exists,
            lang: LANG.UA,
            field: 'title',
            value: title_ua,
          })
        }
      }

      if (title_en) {
        const existing = await this.translateRepo.findOne({
          where: { entity_id: { id }, lang: LANG.EN, field: 'title' },
        })
        if (existing) {
          await this.translateRepo.update(existing.id, { value: title_en })
        } else {
          await this.translateRepo.save({
            entity_id: exists,
            lang: LANG.EN,
            field: 'title',
            value: title_en,
          })
        }
      }
    } catch (err) {
      this.logger.error(`Error while updating format_group: ${err}`)
      throw new BadRequestException('format_group is NOT_UPDATED')
    }

    return (await this.repo.findOne({ where: { id }, relations: ['translates'] })) as FormatGroup
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
