import * as sharp from 'sharp'
import * as path from 'path'
import * as fs from 'fs-extra'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from './entities/product.entity'
import { In, Repository } from 'typeorm'
import { ProductCreateDto } from 'src/product/dto/product-create.dto'
import { ProductUpdateDto } from 'src/product/dto/product-update.dto'
import { Section } from 'src/section/entities/section.entity'
import { ProductParametersDto } from './dto/product-parameters.dto'
import { Parameter } from 'src/parameter/entities/parameter.entity'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { LANG } from 'src/common/enums/translation.enum'
import { ProductCreateTranslateDto } from './dto/product-create-translate.dto'
import { ProductTranslate } from './entities/product-translate.entity'
import { ProductUpdateTranslateDto } from './dto/product-update-translate.dto'
import { ProductCreateImageDto } from './dto/product-create-image.dto'
import { ProductImage } from './entities/product-image.entity'
import { ProductWithoutRatings } from 'src/common/utils/apply-rating'
import { Request } from 'express'
import { Category } from 'src/category/entities/category.entity'

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name)

  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Parameter) private parameterRepo: Repository<Parameter>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Section) private sectionRepo: Repository<Section>,
    @InjectRepository(ProductTranslate)
    private entityTranslateRepo: Repository<ProductTranslate>,
    @InjectRepository(ProductImage)
    private entityImageRepo: Repository<ProductImage>
  ) {}

  async searchByTitle(
    query: string,
    lang: LANG
  ): Promise<{
    entities: ProductWithoutRatings[]
    categories: { id: number; title: string }[]
  }> {
    let queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.translates', 'translates')
      .leftJoinAndSelect('product.category_id', 'category_id')
      .leftJoinAndSelect('product.format_groups', 'format_groups')
      .leftJoinAndSelect('product.images', 'images')
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COALESCE(AVG(r.rating), 0)')
            .from('rating', 'r')
            .where('r.productIdId = product.id'),
        'average_rating'
      )
      .where('LOWER(product.title) LIKE :title', {
        title: `%${query.toLowerCase()}%`
      })
      .orderBy('product.created_at', 'DESC')
      .take(5)

    let result = await queryBuilder.getRawAndEntities()

    if (!result.entities.length) {
      queryBuilder = this.productRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.translates', 'translates')
        .leftJoinAndSelect('product.category_id', 'category_id')
        .leftJoinAndSelect('product.format_groups', 'format_groups')
        .leftJoinAndSelect('product.images', 'images')
        .addSelect(
          (subQuery) =>
            subQuery
              .select('COALESCE(AVG(r.rating), 0)')
              .from('rating', 'r')
              .where('r.productIdId = product.id'),
          'average_rating'
        )
        .where('LOWER(translates.value) LIKE :title', {
          title: `%${query.toLowerCase()}%`
        })
        .andWhere('translates.field = :field', { field: 'title' })
        .orderBy('product.created_at', 'DESC')
        .take(5)

      result = await queryBuilder.getRawAndEntities()
    }

    const entities = result.entities.map((entity, index) => {
      const raw = result.raw[index]
      if (raw.average_rating !== undefined) {
        entity.rating = parseFloat(raw.average_rating) || 0
      }
      return entity
    })

    const categories = [
      ...new Map(
        entities
          .filter((e: Product) => e.category_id)
          .map((e: Product) => [
            e.category_id.id,
            {
              id: e.category_id.id,
              title: e.category_id.title,
              url: e.category_id.url,
              images: e.category_id.images
            }
          ])
      ).values()
    ]

    const mappedEntities = applyTranslations(entities, lang)

    for (const product of mappedEntities) {
      if (product.category_id && product.category_id.translates) {
        product.category_id = applyTranslations([product.category_id], lang)[0]
      }

      if (product.parameters && Array.isArray(product.parameters)) {
        product.parameters = product.parameters.map((param) =>
          param && param.translates
            ? applyTranslations([param], lang)[0]
            : param
        )
      }
    }

    return {
      entities: mappedEntities,
      categories
    }
  }

  async findPromotedOnMainPage(lang: LANG): Promise<ProductWithoutRatings[]> {
    const result = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category_id', 'category_id')
      .leftJoinAndSelect('product.format_groups', 'format_groups')
      .leftJoinAndSelect('category_id.translates', 'category_translates')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.translates', 'translates')
      .leftJoinAndSelect('product.parameters', 'parameters')
      .leftJoinAndSelect('parameters.translates', 'parameter_translates')
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COALESCE(AVG(r.rating), 0)')
            .from('rating', 'r')
            .where('r.productIdId = product.id'),
        'average_rating'
      )
      .where('product.show_on_main_page = :showOnMainPage', {
        showOnMainPage: true
      })
      .take(20)
      .getRawAndEntities()

    const products = result.entities.map((entity, index) => {
      const raw = result.raw[index]
      if (raw.average_rating !== undefined) {
        entity.rating = parseFloat(raw.average_rating) || 0
      }
      return entity
    })

    const mappedEntities = applyTranslations(products, lang)

    for (const product of mappedEntities) {
      if (product.category_id && product.category_id.translates) {
        product.category_id = applyTranslations([product.category_id], lang)[0]
      }

      if (product.parameters && Array.isArray(product.parameters)) {
        product.parameters = product.parameters.map((param: Parameter) =>
          param && param.translates
            ? applyTranslations([param], lang)[0]
            : param
        )
      }
    }

    return mappedEntities
  }

  async find(
    take: number,
    skip: number,
    lang: LANG
  ): Promise<{ entities: ProductWithoutRatings[]; count: number }> {
    const result = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category_id', 'category_id')
      .leftJoinAndSelect('product.format_groups', 'format_groups')
      .leftJoinAndSelect('category_id.translates', 'category_translates')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.translates', 'translates')
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COALESCE(AVG(r.rating), 0)')
            .from('rating', 'r')
            .where('r.productIdId = product.id'),
        'average_rating'
      )
      .orderBy('product.created_at', 'DESC')
      .take(take)
      .skip(skip)
      .getRawAndEntities()

    let mappedEntities = applyTranslations(result.entities, lang)

    mappedEntities = mappedEntities.map((product) => {
      if (product.category_id && product.category_id.translates) {
        product.category_id = applyTranslations([product.category_id], lang)[0]
      }

      return product
    })

    const count = await this.productRepo.count()

    return { entities: mappedEntities, count }
  }

  private async getAllChildrenCategoryUrls(
    categoryUrls: string[]
  ): Promise<string[]> {
    if (!categoryUrls?.length) return []

    const treeRepo = this.categoryRepo.manager.getTreeRepository(Category)

    const urls = new Set<string>()

    for (const url of categoryUrls) {
      const root = await this.categoryRepo.findOne({ where: { url } })
      if (!root) continue

      const descendants = await treeRepo.findDescendants(root)
      for (const desc of descendants) {
        if (desc?.url) urls.add(desc.url)
      }
    }

    return Array.from(urls)
  }

  private async getAllChildrenCategoryIds(
    categoryIds: number[]
  ): Promise<number[]> {
    if (!categoryIds?.length) return []

    const treeRepo = this.categoryRepo.manager.getTreeRepository(Category)

    const ids = new Set<number>()

    for (const id of categoryIds) {
      const root = await this.categoryRepo.findOne({ where: { id } })
      if (!root) continue

      const descendants = await treeRepo.findDescendants(root)
      for (const desc of descendants) {
        if (desc?.id) ids.add(desc.id)
      }
    }

    return Array.from(ids)
  }

  async findByCategory(
    categoryId: number,
    lang: LANG
  ): Promise<ProductWithoutRatings[]> {
    const root = await this.categoryRepo.findOne({ where: { id: categoryId } })
    if (!root) return []

    const treeRepo = this.categoryRepo.manager.getTreeRepository(Category)
    const descendants = await treeRepo.findDescendants(root)
    const categoryIds = descendants.map((c) => c.id)

    if (!categoryIds.length) return []

    const result = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category_id', 'category_id')
      .leftJoinAndSelect('product.format_groups', 'format_groups')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.translates', 'translates')
      .leftJoinAndSelect('category_id.translates', 'category_translates')
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COALESCE(AVG(r.rating), 0)')
            .from('rating', 'r')
            .where('r.productIdId = product.id'),
        'average_rating'
      )
      .where('product.category_id IN (:...categoryIds)', { categoryIds })
      .andWhere('product.is_hidden = :isHidden', { isHidden: false })
      .orderBy('product.created_at', 'DESC')
      .getRawAndEntities()

    const products = result.entities.map((entity, index) => {
      const raw = result.raw[index]
      if (raw.average_rating !== undefined) {
        entity.rating = parseFloat(raw.average_rating) || 0
      }
      return entity
    })

    let mappedEntities = applyTranslations(products, lang)

    mappedEntities = mappedEntities.map((product) => {
      if (product.category_id && product.category_id.translates) {
        product.category_id = applyTranslations([product.category_id], lang)[0]
      }

      if (product.parameters && Array.isArray(product.parameters)) {
        product.parameters = product.parameters.map((param: Parameter) =>
          param && param.translates
            ? applyTranslations([param], lang)[0]
            : param
        )
      }

      return product
    })

    return mappedEntities
  }

  async filter(
    categories: string,
    parameters: string,
    sections: string,
    take: number,
    skip: number,
    lang: LANG,
    start_point?: number,
    end_point?: number,
    startAt?: string,
    endAt?: string
  ) {
    const mappedCategories = categories?.trim().length
      ? categories.split(',').map((item) => String(item))
      : []

    const mappedParameters: number[] = parameters?.trim().length
      ? parameters.split(',').map((item) => Number(item))
      : []

    const mappedSections: number[] = sections?.trim().length
      ? sections.split(',').map((item) => Number(item))
      : []

    const allCategoryUrls: string[] = mappedCategories.length
      ? await this.getAllChildrenCategoryUrls(mappedCategories)
      : []

    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category_id', 'category_id')
      .leftJoinAndSelect('product.format_groups', 'format_groups')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.translates', 'translates')
      .where('product.is_hidden = :isHidden', { isHidden: false })

    if (allCategoryUrls.length > 0) {
      queryBuilder.andWhere('category_id.url IN (:...categories)', {
        categories: allCategoryUrls
      })
    }

    if (mappedParameters.length > 0) {
      queryBuilder.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('pp.product_id')
          .from('product_parameters', 'pp')
          .where('pp.parameter_id IN (:...parameters)', {
            parameters: mappedParameters
          })
          .groupBy('pp.product_id')
          .having('COUNT(DISTINCT pp.parameter_id) = :paramCount', {
            paramCount: mappedParameters.length
          })
          .getQuery()
        return 'product.id IN ' + subQuery
      })
    }

    if (mappedSections.length > 0) {
      queryBuilder.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('ps.product_id')
          .from('product_section', 'ps')
          .where('ps.section_id IN (:...sections)', {
            sections: mappedSections
          })
          .getQuery()
        return 'product.id IN ' + subQuery
      })
    }

    if (start_point && typeof start_point === 'number') {
      queryBuilder.innerJoin(
        'roadmap',
        'start_roadmap',
        'start_roadmap.product_id = product.id'
      )
      queryBuilder.andWhere(
        'start_roadmap.start_point = true AND start_roadmap.city_id = :startPoint',
        { startPoint: start_point }
      )
    }

    if (end_point && typeof end_point === 'number') {
      queryBuilder.innerJoin(
        'roadmap',
        'end_roadmap',
        'end_roadmap.product_id = product.id'
      )
      queryBuilder.andWhere(
        'end_roadmap.end_point = true AND end_roadmap.city_id = :endPoint',
        { endPoint: end_point }
      )
    }

    let queryStartDate: Date | null = null
    let queryEndDate: Date | null = null

    if (startAt && typeof startAt === 'string') {
      const parsedStart = new Date(startAt)
      if (!isNaN(parsedStart.getTime())) queryStartDate = parsedStart
    }
    if (endAt && typeof endAt === 'string') {
      const parsedEnd = new Date(endAt)
      if (!isNaN(parsedEnd.getTime())) queryEndDate = parsedEnd
    }

    if (queryStartDate && queryEndDate) {
      queryBuilder.andWhere(
        '(product.start_at <= :queryEnd AND (product.end_at IS NULL OR product.end_at >= :queryStart))',
        {
          queryStart: queryStartDate.toISOString(),
          queryEnd: queryEndDate.toISOString()
        }
      )
    } else if (queryStartDate) {
      const queryDate = queryStartDate.toISOString()
      queryBuilder.andWhere(
        'product.start_at <= :queryDate AND (product.end_at IS NULL OR product.end_at >= :queryDate)',
        { queryDate }
      )
    } else if (queryEndDate) {
      const queryDate = queryEndDate.toISOString()
      queryBuilder.andWhere(
        'product.start_at <= :queryDate AND (product.end_at IS NULL OR product.end_at >= :queryDate)',
        { queryDate }
      )
    }

    queryBuilder.take(take).skip(skip)

    const [entities, count] = await queryBuilder.getManyAndCount()

    const mappedEntities = applyTranslations(entities, lang)

    return { entities: mappedEntities, count }
  }

  async findMany(ids: number[], lang: LANG): Promise<Product[]> {
    const products = await this.productRepo.find({
      where: { id: In(ids) },
      relations: [
        'category_id',
        'parent_id',
        'images',
        'translates',
        'format_groups',
        'parameters',
        'parameters.translates',
        'ratings'
      ]
    })

    if (!products.length) throw new NotFoundException('product is NOT_FOUND')

    let mappedProducts = applyTranslations(products, lang)

    mappedProducts = mappedProducts.map((prod) => {
      if (prod.category_id && prod.category_id.translates) {
        prod.category_id = applyTranslations([prod.category_id], lang)[0]
      }

      if (prod.parameters && Array.isArray(prod.parameters)) {
        prod.parameters = prod.parameters.map((param: Parameter) =>
          param && param.translates
            ? applyTranslations([param], lang)[0]
            : param
        )
      }

      return prod
    })

    return mappedProducts
  }

  async findOne(id: number, lang: LANG, req: Request): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: [
        'category_id',
        'parent_id',
        'images',
        'translates',
        'format_groups',
        'parameters',
        'parameters.translates',
        'ratings'
      ]
    })

    if (!product) throw new NotFoundException('product is NOT_FOUND')

    if (req?.session) {
      if (!req.session.products || !Array.isArray(req.session.products)) {
        req.session.products = []
      }

      if (!req.session.products.includes(product.id)) {
        req.session.products.push(product.id)
      }
    }

    let mappedProduct = applyTranslations([product], lang)

    mappedProduct = mappedProduct.map((prod) => {
      if (prod.category_id && prod.category_id.translates) {
        prod.category_id = applyTranslations([prod.category_id], lang)[0]
      }

      if (prod.parameters && Array.isArray(prod.parameters)) {
        prod.parameters = prod.parameters.map((param: Parameter) =>
          param && param.translates
            ? applyTranslations([param], lang)[0]
            : param
        )
      }

      return prod
    })

    return mappedProduct[0]
  }

  async findOneByUrl(
    url: string,
    lang: LANG,
    req: Request
  ): Promise<{
    product: ProductWithoutRatings
    children: ProductWithoutRatings[]
  }> {
    const product = await this.productRepo.findOne({
      where: { url },
      relations: [
        'category_id',
        'parent_id',
        'images',
        'translates',
        'parameters',
        'parameters.translates',
        'format_groups',
        'ratings'
      ]
    })

    if (!product) throw new NotFoundException('product is NOT_FOUND')

    if (req?.session) {
      if (!req.session.products || !Array.isArray(req.session.products)) {
        req.session.products = []
      }

      if (!req.session.products.includes(product.id)) {
        req.session.products.push(product.id)
      }
    }

    let children: Product[] = []

    if (product) {
      children = await this.productRepo.find({
        where: { parent_id: { id: product.id } },
        relations: [
          'category_id',
          'category_id.translates',
          'parent_id',
          'images',
          'translates',
          'parameters',
          'parameters.translates',
          'format_groups'
        ]
      })
    }

    let mappedProduct = applyTranslations([product], lang)

    mappedProduct = mappedProduct.map((prod) => {
      if (prod.category_id && prod.category_id.translates) {
        prod.category_id = applyTranslations([prod.category_id], lang)[0]
      }

      if (prod.parameters && Array.isArray(prod.parameters)) {
        prod.parameters = prod.parameters.map((param: Parameter) =>
          param && param.translates
            ? applyTranslations([param], lang)[0]
            : param
        )
      }

      return prod
    })

    const childrenWithRating: Product[] = []
    for (const child of children) {
      const ratingResult = await this.productRepo
        .createQueryBuilder()
        .select('COALESCE(AVG(r.rating), 0)', 'averageRating')
        .from('rating', 'r')
        .where('r.productIdId = :productId', { productId: child.id })
        .getRawOne()

      child.rating = parseFloat(ratingResult.averageRating) || 0
      childrenWithRating.push(child)
    }

    let mappedChildren = applyTranslations(childrenWithRating, lang)

    mappedChildren = mappedChildren.map((child) => {
      if (child.category_id && child.category_id.translates) {
        child.category_id = applyTranslations([child.category_id], lang)[0]
      }

      if (child.parameters && Array.isArray(child.parameters)) {
        child.parameters = child.parameters.map((param) =>
          param && param.translates
            ? applyTranslations([param], lang)[0]
            : param
        )
      }

      return child
    })

    return {
      product: mappedProduct[0],
      children: mappedChildren
    }
  }

  async findRecommended(
    productIds: number[],
    lang: LANG
  ): Promise<ProductWithoutRatings[]> {
    if (!productIds.length) return []

    const result = await this.productRepo
      .createQueryBuilder('product')
      .innerJoin('product.recommendedBy', 'recommendedBy')
      .leftJoinAndSelect('product.category_id', 'category_id')
      .leftJoinAndSelect('product.format_groups', 'format_groups')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.translates', 'translates')
      .leftJoinAndSelect('category_id.translates', 'category_translates')
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COALESCE(AVG(r.rating), 0)')
            .from('rating', 'r')
            .where('r.productIdId = product.id'),
        'average_rating'
      )
      .where('recommendedBy.id IN (:...productIds)', { productIds })
      .andWhere('product.is_hidden = :isHidden', { isHidden: false })
      .take(10)
      .getRawAndEntities()

    const recommendedProducts = result.entities.map((entity, index) => {
      const raw = result.raw[index]
      if (raw.average_rating !== undefined) {
        entity.rating =
          Math.round(parseFloat(raw.average_rating) * 10) / 10 || 0
      }
      return entity
    })

    let mappedEntities = applyTranslations(recommendedProducts, lang)

    mappedEntities = mappedEntities.map((product) => {
      if (product.category_id && product.category_id.translates) {
        product.category_id = applyTranslations([product.category_id], lang)[0]
      }
      return product
    })

    return mappedEntities
  }

  async findReplacementProducts(
    categoryIds: number[],
    lang: LANG,
    take: number = 10
  ): Promise<ProductWithoutRatings[]> {
    if (!categoryIds.length) return []

    const result = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category_id', 'category_id')
      .leftJoinAndSelect('product.format_groups', 'format_groups')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.translates', 'translates')
      .leftJoinAndSelect('category_id.translates', 'category_translates')
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COALESCE(AVG(r.rating), 0)')
            .from('rating', 'r')
            .where('r.productIdId = product.id'),
        'average_rating'
      )
      .where('product.category_id IN (:...categoryIds)', { categoryIds })
      .andWhere('product.is_hidden = :isHidden', { isHidden: false })
      .take(take)
      .getRawAndEntities()

    const replacementProducts = result.entities.map((entity, index) => {
      const raw = result.raw[index]
      if (raw.average_rating !== undefined) {
        entity.rating =
          Math.round(parseFloat(raw.average_rating) * 10) / 10 || 0
      }
      return entity
    })

    const shuffledProducts = replacementProducts.sort(() => Math.random() - 0.5)

    let mappedEntities = applyTranslations(shuffledProducts, lang)

    mappedEntities = mappedEntities.map((product) => {
      if (product.category_id && product.category_id.translates) {
        product.category_id = applyTranslations([product.category_id], lang)[0]
      }
      return product
    })

    return mappedEntities
  }

  async create(dto: ProductCreateDto): Promise<Product> {
    const url = dto.url && String(dto.url).trim() !== '' ? dto.url : undefined
    const productPayload: any = {
      ...dto,
      parent_id: dto.parent_id ?? undefined,
      ...(url ? { url } : {})
    }

    const sectionsIds = Array.isArray(dto.sections) ? dto.sections : undefined
    if (sectionsIds) delete productPayload.sections

    const product = this.productRepo.create(productPayload)

    try {
      const saved = (await this.productRepo.save(product as any)) as Product

      if (sectionsIds && sectionsIds.length) {
        const sectionEntities = await this.sectionRepo.findBy({
          id: In(sectionsIds)
        })
        saved.sections = sectionEntities.length ? sectionEntities : []
        await this.productRepo.save(saved)
      }

      return saved
    } catch (err) {
      this.logger.error(`Error while creating product \n ${err}`)
      throw new BadRequestException('product is NOT_CREATED')
    }
  }

  async update(id: number, dto: ProductUpdateDto): Promise<Product | null> {
    const product = await this.productRepo.findOne({ where: { id } })

    if (!product) throw new NotFoundException('product is NOT_FOUND')

    try {
      const url = dto.url && String(dto.url).trim() !== '' ? dto.url : undefined

      const sectionsIds =
        (dto as any).sections !== undefined ? (dto as any).sections : undefined
      const updatePayload: any = {
        ...dto,
        parent_id: dto.parent_id ?? undefined,
        ...(url ? { url } : {})
      }

      if (sectionsIds !== undefined) delete updatePayload.sections

      await this.productRepo.update({ id }, updatePayload)

      if (sectionsIds !== undefined) {
        const sectionEntities = sectionsIds?.length
          ? await this.sectionRepo.findBy({ id: In(sectionsIds) })
          : []
        const existing = (await this.productRepo.findOne({
          where: { id }
        })) as Product
        existing.sections = sectionEntities.length ? sectionEntities : []
        await this.productRepo.save(existing)
      }

      return (await this.productRepo.findOne({ where: { id } })) as Product
    } catch (err) {
      this.logger.error(`Error while updating product \n ${err}`)
      throw new BadRequestException(`product is NOT_UPDATED`)
    }
  }

  async updateParameters(
    id: number,
    dto: ProductParametersDto
  ): Promise<Product | null> {
    const product = await this.productRepo.findOne({ where: { id } })
    if (!product) throw new NotFoundException('product is NOT_FOUND')

    try {
      const parameters = await this.parameterRepo.findBy({
        id: In(dto.parameters)
      })

      product.parameters = parameters.length ? parameters : []
      await this.productRepo.save(product)
    } catch (err) {
      this.logger.error(`Error to update paramaters in product \n ${err}`)
      throw new BadRequestException('NOT_UPDATED')
    }

    try {
      return (await this.productRepo.findOne({
        where: { id },
        relations: [
          'category_id',
          'parent_id',
          'images',
          'translates',
          'parameters',
          'format_groups',
          'ratings'
        ]
      })) as Product
    } catch (err) {
      this.logger.error(`Error while fetching product with id ${id}: ${err}`)
      throw new BadRequestException(
        'Failed to fetch product after updating parameters SERVER_ERROR'
      )
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.productRepo.delete(id)
      if (result.affected === 0) {
        throw new NotFoundException('product is NOT_FOUND')
      } else {
        await this.deleteImages(id)
      }
    } catch (err) {
      this.logger.error(`Error while deleting product \n ${err}`)

      if (err.code === '23503') {
        throw new BadRequestException('product HAS_CHILDS')
      }

      throw err
    }

    return { message: 'SUCCESS' }
  }

  async createTranslates(
    dto: ProductCreateTranslateDto[]
  ): Promise<ProductTranslate[] | null> {
    if (dto?.length) {
      const results: ProductTranslate[] = []

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
    dto: ProductUpdateTranslateDto[]
  ): Promise<ProductTranslate[] | null> {
    const results: ProductTranslate[] = []

    for (const translate of dto) {
      const result = await this.entityTranslateRepo.update(translate.id, {
        ...translate
      })

      if (result.affected === 0)
        throw new NotFoundException('product translate is NOT_FOUND')

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
      throw new NotFoundException('product translate is NOT_FOUND')
    }

    return { message: 'OK' }
  }

  async createImage(dto: ProductCreateImageDto): Promise<ProductImage> {
    const entity_id =
      typeof dto.entity_id === 'number' ? { id: dto.entity_id } : dto.entity_id

    const newImage = this.entityImageRepo.create({
      ...dto,
      entity_id
    })
    try {
      return await this.entityImageRepo.save(newImage)
    } catch (err) {
      this.logger.error(`Error while saving product image: ${err}`)
      throw new BadRequestException('product image is NOT_CREATED')
    }
  }

  async uploadImages(
    files: Express.Multer.File[],
    entity_id: number
  ): Promise<{ message: string }> {
    for (const file of files) {
      const fileName = `${Date.now()}.webp`

      const uploadDir = path.join(process.cwd(), 'uploads', 'product')
      await fs.ensureDir(uploadDir)

      const outputFilePath = path.join(uploadDir, fileName)

      try {
        await sharp(file.buffer).avif().toFile(outputFilePath)

        const body: ProductCreateImageDto = {
          custom_id: '',
          name: fileName,
          path: `/uploads/product/${fileName}`,
          entity_id: entity_id
        }

        try {
          await this.createImage(body)
        } catch (err) {
          this.logger.warn(
            `Error to create image for entity_id: ${entity_id}: ${err}`
          )
          throw new BadRequestException('product image is NOT_CREATED')
        }
      } catch (err) {
        this.logger.warn(`Error to upload file ${fileName}: ${err}`)
        throw new BadRequestException('product image is NOT_UPLOADED')
      }
    }

    return {
      message: 'Images saved'
    }
  }

  async deleteImage(id: number): Promise<void> {
    const image = await this.entityImageRepo.findOne({ where: { id } })

    if (!image) throw new NotFoundException('product is NOT_FOUND')

    try {
      if (fs.existsSync(image.path)) {
        fs.unlinkSync(image.path)
      } else {
        this.logger.warn(`File at path ${image.path} does not exist`)
      }
    } catch (err) {
      this.logger.error(`Failed to delete file at path ${image.path}: ${err}`)
    }

    await this.entityImageRepo.delete(id)
  }

  async deleteImages(entity_id: number): Promise<{ message: string } | void> {
    const deleteCandidates = await this.entityImageRepo.find({
      where: { entity_id: { id: entity_id } }
    })

    if (deleteCandidates?.length) {
      const filePathList = deleteCandidates.map(
        (field: ProductImage) => field.path
      )

      for (const filePath of filePathList) {
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
          } else {
            this.logger.warn(`File at path ${filePath} does not exist`)
          }
        } catch (err) {
          this.logger.error(`Failed to delete file at path ${filePath}: ${err}`)
        }
      }
    }
  }

  async deleteImagesByIds(ids: number[]): Promise<{ message: string }> {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new BadRequestException('ids is required')
    }

    const images = await this.entityImageRepo.findBy({ id: In(ids) })

    if (!images.length) {
      return { message: 'No images found for given ids' }
    }

    for (const image of images) {
      try {
        if (fs.existsSync(image.path)) {
          fs.unlinkSync(image.path)
        } else {
          this.logger.warn(`File at path ${image.path} does not exist`)
        }
      } catch (err) {
        this.logger.error(`Failed to delete file at path ${image.path}: ${err}`)
      }
    }

    try {
      await this.entityImageRepo.delete(ids)
    } catch (err) {
      this.logger.error(`Failed to delete image records: ${err}`)
      throw new BadRequestException('Failed to delete images')
    }

    return { message: 'Images deleted' }
  }

  async searchShort(q: string) {
    if (!q || q.length < 1) return []

    try {
      return await this.productRepo
        .createQueryBuilder('product')
        .select(['product.id', 'product.custom_id', 'product.title'])
        .where('LOWER(product.title) LIKE :q', { q: `%${q.toLowerCase()}%` })
        .orWhere('product.custom_id LIKE :q2', { q2: `%${q}%` })
        .orderBy('product.created_at', 'DESC')
        .limit(20)
        .getMany()
    } catch (err) {
      this.logger.error(`Error in searchShort: ${err}`)
      throw new BadRequestException({
        message: 'SEARCH_FAILED',
        code: 'SEARCH_FAILED'
      })
    }
  }

  async getImagesByProduct(productId: number): Promise<ProductImage[]> {
    const product = await this.productRepo.findOne({ where: { id: productId } })

    if (!product) throw new NotFoundException('product is NOT_FOUND')

    const images = await this.entityImageRepo.find({
      where: { entity_id: { id: productId } },
      order: { order: 'ASC' }
    })

    return images
  }
}
