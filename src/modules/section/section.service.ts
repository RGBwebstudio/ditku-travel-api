import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { SectionCreateTranslateDto } from './dto/section-create-translate.dto'
import { SectionCreateDto } from './dto/section-create.dto'
import { SectionUpdateTranslateDto } from './dto/section-update-translate.dto'
import { SectionUpdateDto } from './dto/section-update.dto'
import { SectionTranslate } from './entities/section-translate.entity'
import { Section } from './entities/section.entity'

@Injectable()
export class SectionService {
  private readonly logger = new Logger(SectionService.name)

  constructor(
    @InjectRepository(Section)
    private readonly repo: Repository<Section>,
    @InjectRepository(SectionTranslate)
    private readonly translateRepo: Repository<SectionTranslate>
  ) {}

  async find(take = 20, skip = 0) {
    const [entities, count] = await this.repo.findAndCount({
      take,
      skip,
      order: { created_at: 'DESC' },
      relations: ['translates'],
    })
    return { entities, count }
  }

  async findOne(id: number): Promise<Section | null> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['translates'],
    })
    if (!entity) throw new NotFoundException('section is NOT_FOUND')
    return entity
  }

  async create(dto: SectionCreateDto): Promise<Section> {
    const data = this.repo.create(dto)
    try {
      return await this.repo.save(data)
    } catch (err) {
      this.logger.error(`Error while creating section: ${err}`)
      throw new BadRequestException('section is NOT_CREATED')
    }
  }

  async update(id: number, dto: SectionUpdateDto): Promise<Section> {
    const exists = await this.repo.findOne({ where: { id } })
    if (!exists) throw new NotFoundException('section is NOT_FOUND')

    try {
      await this.repo.update(id, { ...dto })
    } catch (err) {
      this.logger.error(`Error while updating section: ${err}`)
      throw new BadRequestException('section is NOT_UPDATED')
    }

    return (await this.repo.findOne({ where: { id } })) as Section
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.repo.delete(id)
      if (result.affected === 0) throw new NotFoundException('section is NOT_FOUND')
    } catch (err) {
      this.logger.error(`Error while deleting section: ${err}`)
      throw err
    }

    return { message: 'SUCCESS' }
  }

  async createTranslates(dto: SectionCreateTranslateDto[]): Promise<SectionTranslate[] | null> {
    if (dto?.length) {
      const results: SectionTranslate[] = []
      for (const t of dto) {
        const data = this.translateRepo.create(t)
        const result = await this.translateRepo.save(data)
        results.push(result)
      }
      return results
    }
    return null
  }

  async updateTranslates(dto: SectionUpdateTranslateDto[]): Promise<SectionTranslate[] | null> {
    const results: SectionTranslate[] = []
    for (const translate of dto) {
      const result = await this.translateRepo.update(translate.id, {
        ...translate,
      })
      if (result.affected === 0) throw new NotFoundException('section translate is NOT_FOUND')
      const updated = await this.translateRepo.findOne({
        where: { id: translate.id },
      })
      if (updated) results.push(updated)
    }
    return results
  }

  async deleteTranslate(id: number): Promise<{ message: string }> {
    const result = await this.translateRepo.delete(id)
    if (result.affected === 0) throw new NotFoundException('section translate is NOT_FOUND')
    return { message: 'OK' }
  }
  async findUsed() {
    const qb = this.repo
      .createQueryBuilder('section')
      .innerJoin('section.products', 'product')
      .leftJoinAndSelect('section.translates', 'translates')

    const entities = await qb.getMany()
    const unique = Array.from(new Map(entities.map((e) => [e.id, e])).values())
    return { entities: unique }
  }
}
