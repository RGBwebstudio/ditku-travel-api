import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Parameter } from './entities/parameter.entity'
import { ParameterDto } from './dto/parameter.dto'
import { ParameterCategory } from 'src/parameter-category/entities/parameter-category.entity'
import { ParameterTranslate } from './entities/category-translate.entity'
import { ParameterCreateTranslateDto } from './dto/parameter-create-translate.dto'
import { ParameterUpdateTranslateDto } from './dto/parameter-update-translate.dto'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { LANG } from 'src/common/enums/translation.enum'
import { Category } from 'src/category/entities/category.entity'
import { Product } from 'src/product/entities/product.entity'

@Injectable()
export class ParameterService {
  private readonly logger = new Logger(ParameterService.name)

  constructor(
    @InjectRepository(Parameter)
    private readonly parameterRepo: Repository<Parameter>,
    @InjectRepository(ParameterCategory)
    private readonly parameterCategoryRepo: Repository<ParameterCategory>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ParameterTranslate)
    private readonly entityTranslateRepo: Repository<ParameterTranslate>
  ) {}

  async findAll(
    take: number,
    skip: number,
    lang: LANG
  ): Promise<{ entities: Parameter[]; count: number }> {
    const entities = await this.parameterRepo.find({
      take,
      skip,
      order: { created_at: 'DESC' },
      relations: ['category_ids', 'translates']
    })

    const count = await this.parameterRepo.count()

    const mappedEntities = applyTranslations(entities, lang)

    return { entities: mappedEntities, count }
  }

  async getAllList(lang: LANG): Promise<{ entities: Parameter[] }> {
    const entities = await this.parameterRepo.find({
      order: { created_at: 'DESC' },
      relations: ['category_ids', 'translates']
    })

    const mappedEntities = applyTranslations(entities, lang)

    return { entities: mappedEntities }
  }

  async searchByTitle(
    query: string,
    lang: LANG
  ): Promise<{ entities: Parameter[] }> {
    if (!query || query.trim().length === 0) return { entities: [] }

    let qb = this.parameterRepo
      .createQueryBuilder('parameter')
      .leftJoinAndSelect('parameter.translates', 'translates')
      .leftJoinAndSelect('parameter.category_ids', 'category_ids')
      .where('LOWER(parameter.title) LIKE :title', {
        title: `%${query.toLowerCase()}%`
      })
      .orderBy('parameter.created_at', 'DESC')
      .take(20)

    let result = await qb.getMany()

    if (!result.length) {
      qb = this.parameterRepo
        .createQueryBuilder('parameter')
        .leftJoinAndSelect('parameter.translates', 'translates')
        .leftJoinAndSelect('parameter.category_ids', 'category_ids')
        .where('LOWER(translates.value) LIKE :title', {
          title: `%${query.toLowerCase()}%`
        })
        .andWhere('translates.field = :field', { field: 'title' })
        .orderBy('parameter.created_at', 'DESC')
        .take(20)

      result = await qb.getMany()
    }

    const mapped = applyTranslations(result, lang)

    return { entities: mapped }
  }

  async findOne(id: number, lang: LANG): Promise<Parameter> {
    const entity = await this.parameterRepo.findOne({
      where: { id },
      relations: ['category_ids', 'translates']
    })
    if (!entity) throw new NotFoundException('parameter is NOT_FOUND')

    const mappedEntity = applyTranslations([entity], lang)

    return mappedEntity[0]
  }

  async create(dto: ParameterDto): Promise<Parameter> {
    const { category_ids, ...rest } = dto
    const parameter = this.parameterRepo.create(rest)

    if (category_ids?.length) {
      const categories = await this.parameterCategoryRepo.find({
        where: { id: In(category_ids) }
      })
      parameter.category_ids = categories
    }

    // Ensure unique title
    const exists = await this.parameterRepo
      .createQueryBuilder('parameter')
      .where('LOWER(parameter.title) = :title', {
        title: (dto.title || '').toLowerCase()
      })
      .getOne()

    if (exists) {
      throw new BadRequestException('NAME_ALREADY_RESERVED')
    }

    try {
      return await this.parameterRepo.save(parameter)
    } catch (err) {
      this.logger.error(`Error while creating parameter ${err}`)
      throw new BadRequestException('NOT_CREATED')
    }
  }

  async update(id: number, dto: ParameterDto): Promise<Parameter> {
    const parameter = await this.parameterRepo.findOne({
      where: { id },
      relations: ['category_ids', 'translates']
    })
    if (!parameter) throw new NotFoundException('parameter is NOT_FOUND')

    // Title uniqueness check
    if (dto.title) {
      const exists = await this.parameterRepo
        .createQueryBuilder('parameter')
        .where('LOWER(parameter.title) = :title', {
          title: dto.title.toLowerCase()
        })
        .andWhere('parameter.id != :id', { id })
        .getOne()

      if (exists) {
        throw new BadRequestException('NAME_ALREADY_RESERVED')
      }
    }

    Object.assign(parameter, dto)

    if (dto.category_ids) {
      const categories = await this.parameterCategoryRepo.find({
        where: { id: In(dto.category_ids) }
      })
      parameter.category_ids = categories
    }

    await this.parameterRepo.save(parameter)
    return parameter
  }

  async delete(id: number): Promise<{ message: string }> {
    const result = await this.parameterRepo.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException('parameter is NOT_FOUND')
    }

    return { message: 'SUCCESS' }
  }

  async createTranslates(
    dto: ParameterCreateTranslateDto[]
  ): Promise<ParameterTranslate[] | null> {
    if (dto?.length) {
      const results: ParameterTranslate[] = []

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
    dto: ParameterUpdateTranslateDto[]
  ): Promise<ParameterTranslate[] | null> {
    const results: ParameterTranslate[] = []

    for (const translate of dto) {
      const result = await this.entityTranslateRepo.update(translate.id, {
        ...translate
      })

      if (result.affected === 0)
        throw new NotFoundException('parameter translate is NOT_FOUND')

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
      throw new NotFoundException('parameter translate is NOT_FOUND')
    }

    return { message: 'OK' }
  }

  async getByProductCategoryUrl(
    categoryUrl: string,
    lang: LANG
  ): Promise<{
    entities: (ParameterCategory & { parameters: Parameter[] })[]
    minMaxPrice?: { min: string; max: string }
  }> {
    if (!categoryUrl) return { entities: [] }

    const treeRepo = this.categoryRepo.manager.getTreeRepository(Category)
    const rootCategory = await this.categoryRepo.findOne({
      where: { url: categoryUrl }
    })
    if (!rootCategory) return { entities: [] }

    const descendants = await treeRepo.findDescendants(rootCategory)

    const categoryIds = descendants.map((c) => c.id).filter(Boolean)

    if (!categoryIds.length) return { entities: [] }

    const parametersInCategory = await this.parameterRepo
      .createQueryBuilder('parameter')
      .leftJoinAndSelect('parameter.category_ids', 'category_ids')
      .leftJoinAndSelect('parameter.translates', 'translates')
      .leftJoin('parameter.products', 'product')
      .leftJoin('product.category_id', 'category')
      .where('category.id IN (:...categoryIds)', { categoryIds })
      .orderBy('parameter.order_in_list', 'ASC')
      .getMany()

    if (!parametersInCategory.length) return { entities: [] }

    const parameterCategoryIds = new Set<number>()

    for (const parameter of parametersInCategory) {
      if (parameter.category_ids?.length) {
        for (const parameterCategory of parameter.category_ids) {
          if (parameterCategory?.id)
            parameterCategoryIds.add(parameterCategory.id)
        }
      }
    }

    if (!parameterCategoryIds.size) return { entities: [] }

    const parameterCategoryIdsArray = Array.from(parameterCategoryIds)

    const parameterCategories = await this.parameterCategoryRepo.find({
      where: { id: In(parameterCategoryIdsArray) },
      relations: ['translates'],
      order: { order_in_list: 'ASC' }
    })

    const translatedParameters = applyTranslations(parametersInCategory, lang)
    const translatedCategories = applyTranslations(parameterCategories, lang)

    const categoryMap = new Map<
      number,
      ParameterCategory & { parameters: Parameter[] }
    >()
    for (const category of translatedCategories) {
      categoryMap.set(category.id, {
        ...category,
        parameters: []
      })
    }

    for (const parameter of translatedParameters) {
      if (!parameter.category_ids?.length) continue
      for (const parameterCategory of parameter.category_ids) {
        const mappedCategory = categoryMap.get(parameterCategory.id)
        if (mappedCategory) {
          const parameterCopy = { ...parameter }
          mappedCategory.parameters.push(parameterCopy)
        }
      }
    }

    const result = Array.from(categoryMap.values()).map((categoryItem) => {
      if (categoryItem.parameters?.length) {
        categoryItem.parameters.sort(
          (a, b) => (a.order_in_list || 0) - (b.order_in_list || 0)
        )
      }
      return categoryItem
    })

    try {
      const priceRaw = await this.productRepo
        .createQueryBuilder('product')
        .select('MIN(product.price)', 'min')
        .addSelect('MAX(product.price)', 'max')
        .where('product.category_id IN (:...categoryIds)', { categoryIds })
        .andWhere('product.is_hidden = false')
        .getRawOne()

      const min = priceRaw?.min ?? null
      const max = priceRaw?.max ?? null

      const minMaxPrice =
        min !== null && max !== null
          ? { min: String(min), max: String(max) }
          : undefined

      return { entities: result, minMaxPrice }
    } catch {
      return { entities: result }
    }
  }
}
