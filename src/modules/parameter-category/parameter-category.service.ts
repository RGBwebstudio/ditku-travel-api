import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { Parameter } from 'src/modules/parameter/entities/parameter.entity'
import { ParameterCategory } from 'src/modules/parameter-category/entities/parameter-category.entity'
import { Repository, In } from 'typeorm'

import { ParameterCategoryCreateTranslateDto } from './dto/parameter-category-create-translate.dto'
import { ParameterCategoryCreateDto } from './dto/parameter-category-create.dto'
import { ParameterCategoryUpdateDto } from './dto/parameter-category-udapte.dto'
import { ParameterCategoryUpdateTranslateDto } from './dto/parameter-category-update-translate.dto'
import { ParameterCategoryTranslate } from './entities/category-translate.entity'

@Injectable()
export class ParameterCategoryService {
  private readonly logger = new Logger(ParameterCategoryService.name)

  constructor(
    @InjectRepository(ParameterCategory)
    private readonly parameterCategoryRepo: Repository<ParameterCategory>,
    @InjectRepository(ParameterCategoryTranslate)
    private readonly entityTranslateRepo: Repository<ParameterCategoryTranslate>,
    @InjectRepository(Parameter)
    private readonly parameterRepo: Repository<Parameter>
  ) {}

  async findAllList(lang: LANG): Promise<{ entities: ParameterCategory[] }> {
    const entities = await this.parameterCategoryRepo.find({
      order: { created_at: 'DESC' },
      relations: ['parameters', 'translates'],
    })

    const mappedEntities = applyTranslations(entities, lang)

    return { entities: mappedEntities }
  }

  async searchByTitle(query: string, lang: LANG): Promise<{ entities: ParameterCategory[] }> {
    if (!query || query.trim().length === 0) return { entities: [] }

    let qb = this.parameterCategoryRepo
      .createQueryBuilder('parameterCategory')
      .leftJoinAndSelect('parameterCategory.translates', 'translates')
      .leftJoinAndSelect('parameterCategory.parameters', 'parameters')
      .where('LOWER(parameterCategory.title) LIKE :title', {
        title: `%${query.toLowerCase()}%`,
      })
      .orderBy('parameterCategory.created_at', 'DESC')
      .take(20)

    let result = await qb.getMany()

    if (!result.length) {
      qb = this.parameterCategoryRepo
        .createQueryBuilder('parameterCategory')
        .leftJoinAndSelect('parameterCategory.translates', 'translates')
        .leftJoinAndSelect('parameterCategory.parameters', 'parameters')
        .where('LOWER(translates.value) LIKE :title', {
          title: `%${query.toLowerCase()}%`,
        })
        .andWhere('translates.field = :field', { field: 'title' })
        .orderBy('parameterCategory.created_at', 'DESC')
        .take(20)

      result = await qb.getMany()
    }

    const mapped = applyTranslations(result, lang)

    return { entities: mapped }
  }

  async findAll(take: number, skip: number, lang: LANG) {
    const entities = await this.parameterCategoryRepo.find({
      take,
      skip,
      order: { created_at: 'DESC' },
      relations: ['parameters', 'translates'],
    })
    const count = await this.parameterCategoryRepo.count()

    const mappedEntities = applyTranslations(entities, lang)

    return { entities: mappedEntities, count }
  }

  async findOne(id: number, lang: LANG): Promise<ParameterCategory> {
    const entity = await this.parameterCategoryRepo.findOne({
      where: { id },
      relations: ['parameters', 'translates'],
    })

    if (!entity) throw new NotFoundException('parameter category is NOT_FOUND')

    const mappedCategory = applyTranslations([entity], lang)

    return mappedCategory[0]
  }

  async create(dto: ParameterCategoryCreateDto) {
    const { parameter_ids, title_ua, title_en, ...categoryData } = dto
    const newEntity = this.parameterCategoryRepo.create(categoryData)

    const exists = await this.parameterCategoryRepo
      .createQueryBuilder('parameterCategory')
      .where('LOWER(parameterCategory.title) = :title', {
        title: (dto.title || '').toLowerCase(),
      })
      .getOne()

    if (exists) {
      throw new BadRequestException('NAME_ALREADY_RESERVED')
    }

    try {
      if (parameter_ids?.length) {
        const parameters = await this.parameterRepo.find({
          where: { id: In(parameter_ids) },
        })
        newEntity.parameters = parameters
      }

      const savedCategory = await this.parameterCategoryRepo.save(newEntity)

      const translationsData: { lang: LANG; field: string; value: string }[] = []
      if (title_ua) translationsData.push({ lang: LANG.UA, field: 'title', value: title_ua })
      if (title_en) translationsData.push({ lang: LANG.EN, field: 'title', value: title_en })

      if (translationsData.length > 0) {
        const translations = translationsData.map((t) => ({
          entity_id: savedCategory,
          ...t,
        }))
        await this.createTranslates(translations)
      }

      return await this.parameterCategoryRepo.findOne({
        where: { id: savedCategory.id },
        relations: ['parameters', 'translates'],
      })
    } catch (err) {
      this.logger.error(`Error while creating parameter category ${err}`)
      throw new BadRequestException('parameter category is NOT_CREATED')
    }
  }

  async update(id: number, dto: ParameterCategoryUpdateDto): Promise<ParameterCategory | null> {
    this.logger.log(`Updating parameter category ${id}: ${JSON.stringify(dto)}`)
    const { parameter_ids, title_ua, title_en, ...categoryData } = dto

    const category = await this.parameterCategoryRepo.findOne({
      where: { id },
      relations: ['parameters'],
    })

    if (!category) throw new NotFoundException('parameter category is NOT_FOUND')

    if (categoryData.title) {
      const exists = await this.parameterCategoryRepo
        .createQueryBuilder('parameterCategory')
        .where('LOWER(parameterCategory.title) = :title', {
          title: categoryData.title.toLowerCase(),
        })
        .andWhere('parameterCategory.id != :id', { id })
        .getOne()

      if (exists) {
        throw new BadRequestException('NAME_ALREADY_RESERVED')
      }
    }

    Object.assign(category, categoryData)

    if (parameter_ids !== undefined) {
      if (parameter_ids.length > 0) {
        const parameters = await this.parameterRepo.find({
          where: { id: In(parameter_ids) },
        })
        category.parameters = parameters
      } else {
        category.parameters = []
      }
    }

    await this.parameterCategoryRepo.save(category)

    const translations: { lang: LANG; field: string; value: string }[] = []
    if (title_ua !== undefined) translations.push({ lang: LANG.UA, field: 'title', value: title_ua })
    if (title_en !== undefined) translations.push({ lang: LANG.EN, field: 'title', value: title_en })

    if (translations.length) {
      for (const t of translations) {
        const existing = await this.entityTranslateRepo.findOne({
          where: {
            entity_id: { id },
            lang: t.lang,
            field: t.field,
          },
        })

        if (existing) {
          existing.value = t.value
          await this.entityTranslateRepo.save(existing)
        } else {
          const newTrans = this.entityTranslateRepo.create({
            entity_id: { id } as unknown as ParameterCategory,
            lang: t.lang,
            field: t.field,
            value: t.value,
          })
          await this.entityTranslateRepo.save(newTrans)
        }
      }
    }

    return await this.parameterCategoryRepo.findOne({
      where: { id },
      relations: ['parameters', 'translates'],
    })
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.parameterCategoryRepo.delete(id)

      if (result.affected === 0) throw new NotFoundException('parameter category is NOT_FOUND')
    } catch (err) {
      if (err.code === '23503') {
        this.logger.error(
          `Cannot delete parameter category with id ${id} because it is associated with one or more products: ${err}`
        )
        throw new BadRequestException('parameter category HAS_CHILDS')
      }

      this.logger.error(`Error while deleting parameter category with id ${id}: ${err}`)

      throw err
    }

    return { message: 'SUCCESS' }
  }

  async createTranslates(dto: ParameterCategoryCreateTranslateDto[]): Promise<ParameterCategoryTranslate[] | null> {
    if (dto?.length) {
      const results: ParameterCategoryTranslate[] = []

      for (const translate of dto) {
        const data = this.entityTranslateRepo.create(translate)
        const result = await this.entityTranslateRepo.save(data)
        results.push(result)
      }

      return results
    }
    return null
  }

  async updateTranslates(dto: ParameterCategoryUpdateTranslateDto[]): Promise<ParameterCategoryTranslate[] | null> {
    const results: ParameterCategoryTranslate[] = []

    for (const translate of dto) {
      const result = await this.entityTranslateRepo.update(translate.id, {
        ...translate,
      })

      if (result.affected === 0) throw new NotFoundException('parameter category translate is NOT_FOUND')

      const updatedEntityTranslate = await this.entityTranslateRepo.findOne({
        where: { id: translate.id },
      })

      if (updatedEntityTranslate) results.push(updatedEntityTranslate)
    }

    return results
  }

  async deleteTranslate(id: number): Promise<{ message: string } | NotFoundException> {
    const result = await this.entityTranslateRepo.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException('parameter category translate is NOT_FOUND')
    }

    return { message: 'OK' }
  }
}
