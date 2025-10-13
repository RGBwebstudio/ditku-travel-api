import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MeasurementCreateDto } from './dto/measurement-create.dto'
import { MeasurementUpdateDto } from './dto/measurement-update.dto'
import { MeasurementTranslate } from './entities/measurement-translate.entity'
import { MeasurementCreateTranslateDto } from './dto/measurement-create-translate.dto'
import { MeasurementUpdateTranslateDto } from './dto/measurement-update-translate.dto'
import { LANG } from 'src/common/enums/translation.enum'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { Measurement } from './entities/measurement.entity'

@Injectable()
export class MeasurementService {
  private readonly logger = new Logger(MeasurementService.name)

  constructor(
    @InjectRepository(Measurement)
    private readonly measurementRepo: Repository<Measurement>,
    @InjectRepository(MeasurementTranslate)
    private readonly entityTranslateRepo: Repository<MeasurementTranslate>
  ) {}

  async findOne(id: number, lang: LANG): Promise<Measurement | null> {
    const entity = await this.measurementRepo.findOne({
      where: { id },
      relations: ['translates']
    })

    if (!entity) throw new NotFoundException('measurement is NOT_FOUND')

    const mappedEntity = applyTranslations([entity], lang)

    return mappedEntity[0]
  }

  async create(dto: MeasurementCreateDto): Promise<Measurement> {
    // Ensure title uniqueness (case-insensitive)
    const exists = await this.measurementRepo
      .createQueryBuilder('measurement')
      .where('LOWER(measurement.title) = :title', {
        title: dto.title?.toLowerCase() || ''
      })
      .getOne()

    if (exists) {
      throw new BadRequestException('NAME_ALREADY_RESERVED')
    }

    // Ensure short title (title_short) uniqueness
    if (dto.title_short) {
      const existsShort = await this.measurementRepo
        .createQueryBuilder('measurement')
        .where('measurement.title_short = :title_short', {
          title_short: dto.title_short
        })
        .getOne()

      if (existsShort) {
        throw new BadRequestException('TITLE_SHORT_ALREADY_EXIST')
      }
    }

    const data = this.measurementRepo.create(dto)

    try {
      return await this.measurementRepo.save(data)
    } catch (err) {
      this.logger.error(`Error while creating measurement: ${err}`)
      throw new BadRequestException('measurement is NOT_CREATED')
    }
  }

  async findAllList(lang: LANG): Promise<{ entities: Measurement[] }> {
    const entities = await this.measurementRepo.find({
      order: { created_at: 'DESC' },
      relations: ['translates']
    })

    const mappedEntities = applyTranslations(entities, lang)

    return { entities: mappedEntities }
  }

  async searchByTitle(
    query: string,
    lang: LANG
  ): Promise<{ entities: Measurement[] }> {
    if (!query || query.trim().length === 0) return { entities: [] }

    let qb = this.measurementRepo
      .createQueryBuilder('measurement')
      .leftJoinAndSelect('measurement.translates', 'translates')
      .where('LOWER(measurement.title) LIKE :title', {
        title: `%${query.toLowerCase()}%`
      })
      .orderBy('measurement.created_at', 'DESC')
      .take(20)

    let result = await qb.getMany()

    if (!result.length) {
      qb = this.measurementRepo
        .createQueryBuilder('measurement')
        .leftJoinAndSelect('measurement.translates', 'translates')
        .where('LOWER(translates.value) LIKE :title', {
          title: `%${query.toLowerCase()}%`
        })
        .andWhere('translates.field = :field', { field: 'title' })
        .orderBy('measurement.created_at', 'DESC')
        .take(20)

      result = await qb.getMany()
    }

    const mapped = applyTranslations(result, lang)

    return { entities: mapped }
  }

  async findAll(
    take: number,
    skip: number,
    lang: LANG
  ): Promise<{ entities: Measurement[]; count: number }> {
    const entities = await this.measurementRepo.find({
      take,
      skip,
      order: { created_at: 'DESC' },
      relations: ['translates']
    })

    const mappedEntities = applyTranslations(entities, lang)

    const count = await this.measurementRepo.count()

    return { entities: mappedEntities, count }
  }

  async update(
    id: number,
    dto: MeasurementUpdateDto
  ): Promise<Measurement | null> {
    // Check uniqueness for title when updating
    if (dto.title) {
      const exists = await this.measurementRepo
        .createQueryBuilder('measurement')
        .where('LOWER(measurement.title) = :title', {
          title: dto.title.toLowerCase()
        })
        .andWhere('measurement.id != :id', { id })
        .getOne()

      if (exists) {
        throw new BadRequestException('NAME_ALREADY_RESERVED')
      }
    }

    // Check uniqueness for short title when updating
    if (dto.title_short) {
      const existsShort = await this.measurementRepo
        .createQueryBuilder('measurement')
        .where('measurement.title_short = :title_short', {
          title_short: dto.title_short
        })
        .andWhere('measurement.id != :id', { id })
        .getOne()

      if (existsShort) {
        throw new BadRequestException('TITLE_SHORT_ALREADY_EXIST')
      }
    }

    const result = await this.measurementRepo.update(id, { ...dto })

    if (result.affected === 0)
      throw new NotFoundException('measurement is NOT_FOUND')

    const updatedCategory = await this.measurementRepo.findOne({
      where: { id }
    })

    return updatedCategory
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.measurementRepo.delete(id)

      if (result.affected === 0) {
        throw new NotFoundException('measurement is NOT_FOUND')
      }
    } catch (err) {
      if (err.code === '23503') {
        throw new BadRequestException('HAS_CHILDS')
      }

      this.logger.error(`Error while deleting measrument \n ${err}`)
      throw err
    }

    return { message: 'SUCCESS' }
  }

  async createTranslates(
    dto: MeasurementCreateTranslateDto[]
  ): Promise<MeasurementTranslate[] | null> {
    if (dto?.length) {
      const results: MeasurementTranslate[] = []

      for (const translate of dto) {
        const data = this.entityTranslateRepo.create(translate)
        const result = await this.entityTranslateRepo.save(data)
        results.push(result)
      }

      return results
    }
    return null
  }

  async updateTranslates(
    dto: MeasurementUpdateTranslateDto[]
  ): Promise<MeasurementTranslate[] | null> {
    const results: MeasurementTranslate[] = []

    for (const translate of dto) {
      const result = await this.entityTranslateRepo.update(translate.id, {
        ...translate
      })

      if (result.affected === 0)
        throw new NotFoundException('measurement translate is NOT_FOUND')

      const updatedEntityTranslate = await this.entityTranslateRepo.findOne({
        where: { id: translate.id }
      })

      if (updatedEntityTranslate) results.push(updatedEntityTranslate)
    }

    return results
  }

  async deleteTranslate(
    id: number
  ): Promise<{ message: string } | NotFoundException> {
    const result = await this.entityTranslateRepo.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException('measurement translate is NOT_FOUND')
    }

    return { message: 'OK' }
  }
}
