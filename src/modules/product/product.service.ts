import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Request } from 'express'
import { LANG } from 'src/common/enums/translation.enum'
import { ProductWithoutRatings } from 'src/common/utils/apply-rating'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { Category } from 'src/modules/category/entities/category.entity'
import { FormatGroup } from 'src/modules/format-group/entities/format-group.entity'
import { Parameter } from 'src/modules/parameter/entities/parameter.entity'
import { ProductCreateDto } from 'src/modules/product/dto/product-create.dto'
import { ProductUpdateDto } from 'src/modules/product/dto/product-update.dto'
import { Roadmap } from 'src/modules/roadmap/entities/roadmap.entity'
import { Section } from 'src/modules/section/entities/section.entity'
import { SeoFilter } from 'src/modules/seo-filter/entities/seo-filter.entity'
import { In, Repository, DeepPartial } from 'typeorm'

import { AddProductImageDto } from './dto/add-product-image.dto'
import { ProductCreateImageDto } from './dto/product-create-image.dto'
import { ProductCreateTranslateDto } from './dto/product-create-translate.dto'
import { ProductParametersDto } from './dto/product-parameters.dto'
import { ProductUpdateTranslateDto } from './dto/product-update-translate.dto'
import { ProductImage } from './entities/product-image.entity'
import { ProductTranslate } from './entities/product-translate.entity'
import { Product } from './entities/product.entity'

type RawRoadmap = {
  id: number
  start_point: boolean
  end_point: boolean
  city_id?: number | { id: number } | null
  time?: string
  description?: string
  order?: number | string | null
}

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name)

  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Parameter) private parameterRepo: Repository<Parameter>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Section) private sectionRepo: Repository<Section>,
    @InjectRepository(FormatGroup)
    private formatGroupRepo: Repository<FormatGroup>,
    @InjectRepository(ProductTranslate)
    private entityTranslateRepo: Repository<ProductTranslate>,
    @InjectRepository(ProductImage)
    private entityImageRepo: Repository<ProductImage>,
    @InjectRepository(SeoFilter)
    private seoFilterRepo: Repository<SeoFilter>
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
      .leftJoinAndSelect('product.seo_filters', 'seo_filters')
      .leftJoinAndSelect('product.category_id', 'category_id')
      .leftJoinAndSelect('product.format_groups', 'format_groups')
      .leftJoinAndSelect('format_groups.translates', 'format_groups_translates')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('format_groups.translates', 'format_groups_translates')
      .leftJoinAndSelect('product.images', 'images')
      .addSelect(
        (subQuery) =>
          subQuery.select('COALESCE(AVG(r.rating), 0)').from('rating', 'r').where('r.productIdId = product.id'),
        'average_rating'
      )
      .where('LOWER(product.title) LIKE :title', {
        title: `%${query.toLowerCase()}%`,
      })
      .orderBy('product.created_at', 'DESC')
      .take(5)

    let result = await queryBuilder.getRawAndEntities()

    if (!result.entities.length) {
      queryBuilder = this.productRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.translates', 'translates')
        .leftJoinAndSelect('product.seo_filters', 'seo_filters')
        .leftJoinAndSelect('product.category_id', 'category_id')
        .leftJoinAndSelect('product.format_groups', 'format_groups')
        .leftJoinAndSelect('format_groups.translates', 'format_groups_translates')
        .leftJoinAndSelect('product.images', 'images')
        .leftJoinAndSelect('format_groups.translates', 'format_groups_translates')
        .leftJoinAndSelect('product.images', 'images')
        .addSelect(
          (subQuery) =>
            subQuery.select('COALESCE(AVG(r.rating), 0)').from('rating', 'r').where('r.productIdId = product.id'),
          'average_rating'
        )
        .where('LOWER(translates.value) LIKE :title', {
          title: `%${query.toLowerCase()}%`,
        })
        .andWhere('translates.field = :field', { field: 'title' })
        .orderBy('product.created_at', 'DESC')
        .take(5)

      result = await queryBuilder.getRawAndEntities()
    }

    const entities = result.entities.map((entity, index) => {
      const rawRow = result.raw[index]
      if (rawRow.average_rating !== undefined) {
        entity.rating = parseFloat(rawRow.average_rating) || 0
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
              images: e.category_id.images,
            },
          ])
      ).values(),
    ]

    const mappedEntities = applyTranslations(entities, lang)

    for (const mappedProductItem of mappedEntities) {
      if (mappedProductItem.category_id && mappedProductItem.category_id.translates) {
        mappedProductItem.category_id = applyTranslations([mappedProductItem.category_id], lang)[0]
      }

      if (mappedProductItem.parameters && Array.isArray(mappedProductItem.parameters)) {
        mappedProductItem.parameters = mappedProductItem.parameters.map((parameter) =>
          parameter && parameter.translates ? applyTranslations([parameter], lang)[0] : parameter
        )
      }

      if (mappedProductItem.format_groups && Array.isArray(mappedProductItem.format_groups)) {
        mappedProductItem.format_groups = mappedProductItem.format_groups.map((item) =>
          item && item.translates ? applyTranslations([item], lang)[0] : item
        )
      }
    }

    return {
      entities: mappedEntities,
      categories,
    }
  }

  async findPromotedOnMainPage(lang: LANG): Promise<ProductWithoutRatings[]> {
    const result = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category_id', 'category_id')
      .leftJoinAndSelect('product.format_groups', 'format_groups')
      .leftJoinAndSelect('format_groups.translates', 'format_groups_translates')
      .leftJoinAndSelect('category_id.translates', 'category_translates')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.translates', 'translates')
      .leftJoinAndSelect('product.seo_filters', 'seo_filters')
      .leftJoinAndSelect('product.parameters', 'parameters')
      .leftJoinAndSelect('parameters.translates', 'parameter_translates')
      .leftJoinAndSelect('product.roadmaps', 'roadmaps')
      .leftJoinAndSelect('roadmaps.translates', 'roadmaps_translates')
      .leftJoinAndSelect('roadmaps.city_id', 'city_id_roadmap')
      .leftJoinAndSelect('city_id_roadmap.translates', 'city_id_roadmap_translates')
      .addSelect(
        (subQuery) =>
          subQuery.select('COALESCE(AVG(r.rating), 0)').from('rating', 'r').where('r.productIdId = product.id'),
        'average_rating'
      )
      .where('product.show_on_main_page = :showOnMainPage', {
        showOnMainPage: true,
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
          param && param.translates ? applyTranslations([param], lang)[0] : param
        )
      }

      if (product.format_groups && Array.isArray(product.format_groups)) {
        product.format_groups = product.format_groups.map((item) =>
          item && item.translates ? applyTranslations([item], lang)[0] : item
        )
      }

      if (product.roadmaps && Array.isArray(product.roadmaps)) {
        const mappedRoadmaps = applyTranslations(product.roadmaps, lang)

        product.roadmaps = mappedRoadmaps.map((rawRoadmap: RawRoadmap) => {
          let city = rawRoadmap.city_id
          if (city && typeof city === 'object') {
            city = applyTranslations([city], lang)[0]
          }

          return Object.assign(new Roadmap(), {
            id: rawRoadmap.id,
            start_point: Boolean(rawRoadmap.start_point),
            end_point: Boolean(rawRoadmap.end_point),
            city_id: city,
            time: rawRoadmap.time || '',
            description: rawRoadmap.description || '',
            order: rawRoadmap.order !== undefined && rawRoadmap.order !== null ? Number(rawRoadmap.order) : undefined,
          })
        })
      }
    }

    return mappedEntities
  }

  async findClosestTours(lang: LANG): Promise<ProductWithoutRatings[]> {
    const result = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category_id', 'category_id')
      .leftJoinAndSelect('product.format_groups', 'format_groups')
      .leftJoinAndSelect('format_groups.translates', 'format_groups_translates')
      .leftJoinAndSelect('category_id.translates', 'category_translates')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.translates', 'translates')
      .leftJoinAndSelect('product.seo_filters', 'seo_filters')
      .leftJoinAndSelect('product.parameters', 'parameters')
      .leftJoinAndSelect('parameters.translates', 'parameter_translates')
      .leftJoinAndSelect('product.roadmaps', 'roadmaps')
      .leftJoinAndSelect('roadmaps.translates', 'roadmaps_translates')
      .leftJoinAndSelect('roadmaps.city_id', 'city_id_roadmap')
      .leftJoinAndSelect('city_id_roadmap.translates', 'city_id_roadmap_translates')
      .addSelect(
        (subQuery) =>
          subQuery.select('COALESCE(AVG(r.rating), 0)').from('rating', 'r').where('r.productIdId = product.id'),
        'average_rating'
      )
      .where('product.start_at >= NOW()')
      .andWhere('product.is_hidden = :isHidden', { isHidden: false })
      .orderBy('product.start_at', 'ASC')
      .take(3)
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
          param && param.translates ? applyTranslations([param], lang)[0] : param
        )
      }

      if (product.format_groups && Array.isArray(product.format_groups)) {
        product.format_groups = product.format_groups.map((item) =>
          item && item.translates ? applyTranslations([item], lang)[0] : item
        )
      }

      if (product.roadmaps && Array.isArray(product.roadmaps)) {
        const mappedRoadmaps = applyTranslations(product.roadmaps, lang)

        product.roadmaps = mappedRoadmaps.map((rawRoadmap: RawRoadmap) => {
          let city = rawRoadmap.city_id
          if (city && typeof city === 'object') {
            city = applyTranslations([city], lang)[0]
          }

          return Object.assign(new Roadmap(), {
            id: rawRoadmap.id,
            start_point: Boolean(rawRoadmap.start_point),
            end_point: Boolean(rawRoadmap.end_point),
            city_id: city,
            time: rawRoadmap.time || '',
            description: rawRoadmap.description || '',
            order: rawRoadmap.order !== undefined && rawRoadmap.order !== null ? Number(rawRoadmap.order) : undefined,
          })
        })
      }
    }

    return mappedEntities
  }

  async find(take: number, skip: number, lang: LANG): Promise<{ entities: ProductWithoutRatings[]; count: number }> {
    const result = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category_id', 'category_id')
      .leftJoinAndSelect('product.format_groups', 'format_groups')
      .leftJoinAndSelect('category_id.translates', 'category_translates')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.translates', 'translates')
      .leftJoinAndSelect('product.seo_filters', 'seo_filters')
      .leftJoinAndSelect('product.parameters', 'parameters')
      .leftJoinAndSelect('parameters.translates', 'parameter_translates')
      .leftJoinAndSelect('product.roadmaps', 'roadmaps')
      .leftJoinAndSelect('roadmaps.translates', 'roadmaps_translates')
      .leftJoinAndSelect('roadmaps.city_id', 'city_id_roadmap')
      .leftJoinAndSelect('city_id_roadmap.translates', 'city_id_roadmap_translates')
      .addSelect(
        (subQuery) =>
          subQuery.select('COALESCE(AVG(r.rating), 0)').from('rating', 'r').where('r.productIdId = product.id'),
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

      if (product.parameters && Array.isArray(product.parameters)) {
        product.parameters = product.parameters.map((parameter: Parameter) =>
          parameter && parameter.translates ? applyTranslations([parameter], lang)[0] : parameter
        )
      }

      if (product.format_groups && Array.isArray(product.format_groups)) {
        product.format_groups = product.format_groups.map((item) =>
          item && item.translates ? applyTranslations([item], lang)[0] : item
        )
      }

      if (product.roadmaps && Array.isArray(product.roadmaps)) {
        const mappedRoadmaps = applyTranslations(product.roadmaps, lang)

        product.roadmaps = mappedRoadmaps.map((rawRoadmap: RawRoadmap) => {
          let city = rawRoadmap.city_id
          if (city && typeof city === 'object') {
            city = applyTranslations([city], lang)[0]
          }

          return Object.assign(new Roadmap(), {
            id: rawRoadmap.id,
            start_point: Boolean(rawRoadmap.start_point),
            end_point: Boolean(rawRoadmap.end_point),
            city_id: city,
            time: rawRoadmap.time || '',
            description: rawRoadmap.description || '',
            order: rawRoadmap.order !== undefined && rawRoadmap.order !== null ? Number(rawRoadmap.order) : undefined,
          })
        })
      }

      return product
    })

    const count = await this.productRepo.count()

    return { entities: mappedEntities, count }
  }

  private async getAllChildrenCategoryUrls(categoryUrls: string[]): Promise<string[]> {
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

  private async getAllChildrenCategoryIds(categoryIds: number[]): Promise<number[]> {
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

  async findByCategory(categoryId: number, lang: LANG): Promise<ProductWithoutRatings[]> {
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
      .leftJoinAndSelect('product.seo_filters', 'seo_filters')
      .leftJoinAndSelect('category_id.translates', 'category_translates')
      .leftJoinAndSelect('product.parameters', 'parameters')
      .leftJoinAndSelect('parameters.translates', 'parameter_translates')
      .leftJoinAndSelect('product.roadmaps', 'roadmaps')
      .leftJoinAndSelect('roadmaps.translates', 'roadmaps_translates')
      .leftJoinAndSelect('roadmaps.city_id', 'city_id_roadmap')
      .leftJoinAndSelect('city_id_roadmap.translates', 'city_id_roadmap_translates')
      .addSelect(
        (subQuery) =>
          subQuery.select('COALESCE(AVG(r.rating), 0)').from('rating', 'r').where('r.productIdId = product.id'),
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
          param && param.translates ? applyTranslations([param], lang)[0] : param
        )
      }

      if (product.roadmaps && Array.isArray(product.roadmaps)) {
        const mappedRoadmaps = applyTranslations(product.roadmaps, lang)

        product.roadmaps = mappedRoadmaps.map((rawRoadmap: RawRoadmap) => {
          let city = rawRoadmap.city_id
          if (city && typeof city === 'object') {
            city = applyTranslations([city], lang)[0]
          }

          return Object.assign(new Roadmap(), {
            id: rawRoadmap.id,
            start_point: Boolean(rawRoadmap.start_point),
            end_point: Boolean(rawRoadmap.end_point),
            city_id: city,
            time: rawRoadmap.time || '',
            description: rawRoadmap.description || '',
            order: rawRoadmap.order !== undefined && rawRoadmap.order !== null ? Number(rawRoadmap.order) : undefined,
          })
        })
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
    endAt?: string,
    seoFilterId?: number
  ) {
    const mappedCategories = categories?.trim().length ? categories.split(',').map((item) => String(item)) : []

    const mappedParameters: number[] = parameters?.trim().length
      ? parameters.split(',').map((item) => Number(item))
      : []

    const mappedSections: number[] = sections?.trim().length ? sections.split(',').map((item) => Number(item)) : []

    const allCategoryUrls: string[] = mappedCategories.length
      ? await this.getAllChildrenCategoryUrls(mappedCategories)
      : []

    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category_id', 'category_id')
      .leftJoinAndSelect('product.format_groups', 'format_groups')
      .leftJoinAndSelect('format_groups.translates', 'format_groups_translates')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.translates', 'translates')
      .leftJoinAndSelect('product.seo_filters', 'seo_filters')
      .leftJoinAndSelect('product.roadmaps', 'roadmaps')
      .leftJoinAndSelect('roadmaps.translates', 'roadmaps_translates')
      .leftJoinAndSelect('roadmaps.city_id', 'city_id_roadmap')
      .leftJoinAndSelect('city_id_roadmap.translates', 'city_id_roadmap_translates')
      .where('product.is_hidden = :isHidden', { isHidden: false })

    // SEO Filter support
    if (seoFilterId && typeof seoFilterId === 'number') {
      queryBuilder.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('psf.product_id')
          .from('product_seo_filters', 'psf')
          .where('psf.seo_filter_id = :seoFilterId', { seoFilterId })
          .getQuery()
        return 'product.id IN ' + subQuery
      })
    }

    if (allCategoryUrls.length > 0) {
      queryBuilder.andWhere('category_id.url IN (:...categories)', {
        categories: allCategoryUrls,
      })
    }

    if (mappedParameters.length > 0) {
      queryBuilder.andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('pp.product_id')
          .from('product_parameters', 'pp')
          .where('pp.parameter_id IN (:...parameters)', {
            parameters: mappedParameters,
          })
          .groupBy('pp.product_id')
          .having('COUNT(DISTINCT pp.parameter_id) = :paramCount', {
            paramCount: mappedParameters.length,
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
            sections: mappedSections,
          })
          .getQuery()
        return 'product.id IN ' + subQuery
      })
    }

    if (start_point && typeof start_point === 'number') {
      queryBuilder.innerJoin('roadmap', 'start_roadmap', 'start_roadmap.product_id = product.id')
      queryBuilder.andWhere('start_roadmap.start_point = true AND start_roadmap.city_id = :startPoint', {
        startPoint: start_point,
      })
    }

    if (end_point && typeof end_point === 'number') {
      queryBuilder.innerJoin('roadmap', 'end_roadmap', 'end_roadmap.product_id = product.id')
      queryBuilder.andWhere('end_roadmap.end_point = true AND end_roadmap.city_id = :endPoint', { endPoint: end_point })
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
          queryEnd: queryEndDate.toISOString(),
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

    let mappedEntities = applyTranslations(entities, lang)

    mappedEntities = mappedEntities.map((product) => {
      if (product.category_id && product.category_id.translates) {
        product.category_id = applyTranslations([product.category_id], lang)[0]
      }

      if (product.parameters && Array.isArray(product.parameters)) {
        product.parameters = product.parameters.map((param: Parameter) =>
          param && param.translates ? applyTranslations([param], lang)[0] : param
        )
      }

      if (product.format_groups && Array.isArray(product.format_groups)) {
        product.format_groups = product.format_groups.map((item) =>
          item && item.translates ? applyTranslations([item], lang)[0] : item
        )
      }

      if (product.roadmaps && Array.isArray(product.roadmaps)) {
        const mappedRoadmaps = applyTranslations(product.roadmaps, lang)

        product.roadmaps = mappedRoadmaps.map((rawRoadmap: RawRoadmap) => {
          let city = rawRoadmap.city_id
          if (city && typeof city === 'object') {
            city = applyTranslations([city], lang)[0]
          }

          return Object.assign(new Roadmap(), {
            id: rawRoadmap.id,
            start_point: Boolean(rawRoadmap.start_point),
            end_point: Boolean(rawRoadmap.end_point),
            city_id: city,
            time: rawRoadmap.time || '',
            description: rawRoadmap.description || '',
            order: rawRoadmap.order !== undefined && rawRoadmap.order !== null ? Number(rawRoadmap.order) : undefined,
          })
        })
      }

      return product
    })

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
        'parameters',
        'parameters.translates',
        'format_groups',
        'format_groups.translates',
        'ratings',
        'roadmaps',
        'roadmaps.translates',
        'roadmaps.city_id',
        'roadmaps.city_id.translates',
        'seo_filters',
      ],
    })

    if (!products.length) throw new NotFoundException('product is NOT_FOUND')

    let mappedProducts = applyTranslations(products, lang)

    mappedProducts = mappedProducts.map((mappedProductItem) => {
      if (mappedProductItem.category_id && mappedProductItem.category_id.translates) {
        mappedProductItem.category_id = applyTranslations([mappedProductItem.category_id], lang)[0]
      }

      if (mappedProductItem.parameters && Array.isArray(mappedProductItem.parameters)) {
        mappedProductItem.parameters = mappedProductItem.parameters.map((parameter: Parameter) =>
          parameter && parameter.translates ? applyTranslations([parameter], lang)[0] : parameter
        )
      }

      if (mappedProductItem.format_groups && Array.isArray(mappedProductItem.format_groups)) {
        mappedProductItem.format_groups = mappedProductItem.format_groups.map((item) =>
          item && item.translates ? applyTranslations([item], lang)[0] : item
        )
      }

      const rawRoadmaps = (mappedProductItem as { roadmaps?: RawRoadmap[] }).roadmaps
      if (Array.isArray(rawRoadmaps)) {
        const mappedRoadmaps = applyTranslations(rawRoadmaps, lang)

        mappedProductItem.roadmaps = mappedRoadmaps.map((rawRoadmap: RawRoadmap) => {
          let city = rawRoadmap.city_id
          if (city && typeof city === 'object') {
            city = applyTranslations([city], lang)[0]
          }

          return Object.assign(new Roadmap(), {
            id: rawRoadmap.id,
            start_point: Boolean(rawRoadmap.start_point),
            end_point: Boolean(rawRoadmap.end_point),
            city_id: city,
            time: rawRoadmap.time || '',
            description: rawRoadmap.description || '',
            order: rawRoadmap.order !== undefined && rawRoadmap.order !== null ? Number(rawRoadmap.order) : undefined,
          })
        })
      }

      return mappedProductItem
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
        'recommendedProducts',
        'recommendedProducts.images',
        'recommendedProducts.translates',
        'recommendedProducts.category_id',
        'format_groups',
        'format_groups.translates',
        'sections',
        'sections.translates',
        'parameters',
        'parameters.translates',
        'ratings',
        'roadmaps',
        'roadmaps.translates',
        'roadmaps.city_id',
        'roadmaps.city_id.translates',
        'seo_filters',
      ],
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

    let mappedProducts = applyTranslations([product], lang)

    mappedProducts = mappedProducts.map((productDto) => {
      if (productDto.category_id && productDto.category_id.translates) {
        productDto.category_id = applyTranslations([productDto.category_id], lang)[0]
      }

      if (productDto.parameters && Array.isArray(productDto.parameters)) {
        productDto.parameters = productDto.parameters.map((param: Parameter) =>
          param && param.translates ? applyTranslations([param], lang)[0] : param
        )
      }

      if (productDto.format_groups && Array.isArray(productDto.format_groups)) {
        productDto.format_groups = productDto.format_groups.map((item) =>
          item && item.translates ? applyTranslations([item], lang)[0] : item
        )
      }

      if (productDto.sections && Array.isArray(productDto.sections)) {
        productDto.sections = productDto.sections.map((section: Section) =>
          section && section.translates ? applyTranslations([section], lang)[0] : section
        )
      }

      return productDto
    })

    const mappedProductDto = mappedProducts[0] as { roadmaps?: RawRoadmap[] }
    const mappedRoadmaps = applyTranslations(product.roadmaps || [], lang)

    const roadmapsDto = mappedRoadmaps.map((roadmapEntity: Roadmap) => {
      let city = roadmapEntity.city_id
      if (city && typeof city === 'object') {
        city = applyTranslations([city], lang)[0]
      }

      return Object.assign(new Roadmap(), {
        id: roadmapEntity.id,
        start_point: Boolean(roadmapEntity.start_point),
        end_point: Boolean(roadmapEntity.end_point),
        city_id: city,
        time: roadmapEntity.time || '',
        description: roadmapEntity.description || '',
        order:
          roadmapEntity.order !== undefined && roadmapEntity.order !== null ? Number(roadmapEntity.order) : undefined,
      })
    })

    mappedProductDto.roadmaps = roadmapsDto

    return mappedProducts[0]
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
        'format_groups.translates',
        'ratings',
        'roadmaps',
        'roadmaps.translates',
        'roadmaps.city_id',
        'roadmaps.city_id.translates',
        'seo_filters',
      ],
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
          'format_groups',
          'format_groups.translates',
        ],
      })
    }

    let mappedProduct = applyTranslations([product], lang)

    mappedProduct = mappedProduct.map((prod) => {
      if (prod.category_id && prod.category_id.translates) {
        prod.category_id = applyTranslations([prod.category_id], lang)[0]
      }

      if (prod.parameters && Array.isArray(prod.parameters)) {
        prod.parameters = prod.parameters.map((param: Parameter) =>
          param && param.translates ? applyTranslations([param], lang)[0] : param
        )
      }

      if (prod.format_groups && Array.isArray(prod.format_groups)) {
        prod.format_groups = prod.format_groups.map((item) =>
          item && item.translates ? applyTranslations([item], lang)[0] : item
        )
      }
      return prod
    })

    const pickedMappedProduct = mappedProduct[0]
    const mappedRoadmaps = applyTranslations(product.roadmaps || [], lang)

    pickedMappedProduct.roadmaps = mappedRoadmaps.map((roadmap) => {
      let city = roadmap.city_id
      if (city && typeof city === 'object') {
        city = applyTranslations([city], lang)[0]
      }

      return Object.assign(new Roadmap(), {
        id: roadmap.id,
        start_point: Boolean(roadmap.start_point),
        end_point: Boolean(roadmap.end_point),
        city_id: city,
        time: roadmap.time || '',
        description: roadmap.description || '',
        order: roadmap.order !== undefined && roadmap.order !== null ? Number(roadmap.order) : undefined,
      })
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

      if (child.format_groups && Array.isArray(child.format_groups)) {
        child.format_groups = child.format_groups.map((item) =>
          item && item.translates ? applyTranslations([item], lang)[0] : item
        )
      }

      if (child.parameters && Array.isArray(child.parameters)) {
        child.parameters = child.parameters.map((param) =>
          param && param.translates ? applyTranslations([param], lang)[0] : param
        )
      }

      return child
    })

    return {
      product: mappedProduct[0],
      children: mappedChildren,
    }
  }

  async findRecommended(productIds: number[], lang: LANG): Promise<ProductWithoutRatings[]> {
    if (!productIds.length) return []

    const result = await this.productRepo
      .createQueryBuilder('product')
      .innerJoin('product.recommendedBy', 'recommendedBy')
      .leftJoinAndSelect('product.category_id', 'category_id')
      .leftJoinAndSelect('product.format_groups', 'format_groups')
      .leftJoinAndSelect('format_groups.translates', 'format_groups_translates')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.translates', 'translates')
      .leftJoinAndSelect('product.seo_filters', 'seo_filters')
      .leftJoinAndSelect('category_id.translates', 'category_translates')
      .addSelect(
        (subQuery) =>
          subQuery.select('COALESCE(AVG(r.rating), 0)').from('rating', 'r').where('r.productIdId = product.id'),
        'average_rating'
      )
      .where('recommendedBy.id IN (:...productIds)', { productIds })
      .take(10)
      .getRawAndEntities()

    const recommendedProducts = result.entities.map((entity, index) => {
      const raw = result.raw[index]
      if (raw.average_rating !== undefined) {
        entity.rating = Math.round(parseFloat(raw.average_rating) * 10) / 10 || 0
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

  async create(dto: ProductCreateDto): Promise<Product> {
    const productPayload = {
      ...dto,
    }

    if (dto.start_date) {
      productPayload.start_at = dto.start_date
      delete productPayload.start_date
    }
    if (dto.end_date) {
      productPayload.end_at = dto.end_date
      delete productPayload.end_date
    }

    const sectionsIds = Array.isArray(dto.sections) ? dto.sections : undefined
    if (sectionsIds) delete productPayload.sections

    const formatGroupIds: number[] | undefined =
      Array.isArray(dto.format_group) && dto.format_group.length ? dto.format_group : undefined
    if (formatGroupIds) delete productPayload.format_group

    const seoFiltersIds = Array.isArray(dto.seo_filters) ? dto.seo_filters : undefined
    if (seoFiltersIds) delete productPayload.seo_filters

    const product = this.productRepo.create(productPayload as DeepPartial<Product>)

    try {
      const saved = await this.productRepo.save(product)

      if (formatGroupIds && formatGroupIds.length) {
        const formatGroups = await this.formatGroupRepo.findBy({
          id: In(formatGroupIds),
        })
        if (formatGroups.length !== formatGroupIds.length) {
          throw new BadRequestException('format_group is NOT_FOUND')
        }
        saved.format_groups = formatGroups
        await this.productRepo.save(saved)
      }

      if (seoFiltersIds && seoFiltersIds.length) {
        const seoFilters = await this.seoFilterRepo.findBy({
          id: In(seoFiltersIds),
        })
        if (seoFilters.length !== seoFiltersIds.length) {
          throw new BadRequestException('seo_filters is NOT_FOUND')
        }
        saved.seo_filters = seoFilters
        await this.productRepo.save(saved)
      }

      // Handle flattened translations
      const translations: ProductCreateTranslateDto[] = []
      const langFields = ['title', 'subtitle', 'seo_title', 'seo_description']

      const payload: any = dto

      for (const field of langFields) {
        if (payload[`${field}_ua`]) {
          translations.push({
            entity_id: saved,
            lang: LANG.UA,
            field: field,
            value: payload[`${field}_ua`],
          })
        }
        if (payload[`${field}_en`]) {
          translations.push({
            entity_id: saved,
            lang: LANG.EN,
            field: field,
            value: payload[`${field}_en`],
          })
        }
      }

      if (translations.length > 0) {
        await this.createTranslates(translations)
      }

      if (sectionsIds && sectionsIds.length) {
        const sectionEntities = await this.sectionRepo.findBy({
          id: In(sectionsIds),
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
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['sections', 'seo_filters', 'parameters', 'format_groups'],
    })

    if (!product) throw new NotFoundException('product is NOT_FOUND')

    try {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const {
        sections,
        format_group,
        seo_filters,
        parameters: rawParams,
        start_date,
        end_date,
        ...rawUpdatePayload
      } = dto as Partial<ProductCreateDto> & Partial<ProductUpdateDto>

      const updatePayload = rawUpdatePayload as any

      if (start_date !== undefined) {
        updatePayload.start_at = start_date
      }
      if (end_date !== undefined) {
        updatePayload.end_at = end_date
      }

      // Apply scalar updates
      Object.assign(product, updatePayload)

      // Handle Relations
      const sectionsIds = dto.sections !== undefined ? dto.sections : undefined
      if (sectionsIds !== undefined) {
        const sectionEntities = sectionsIds?.length ? await this.sectionRepo.findBy({ id: In(sectionsIds) }) : []
        product.sections = sectionEntities
      }

      const seoFiltersIds: number[] | undefined =
        dto.seo_filters !== undefined && Array.isArray(dto.seo_filters) ? dto.seo_filters : undefined
      if (seoFiltersIds !== undefined) {
        const seoFilterEntities = seoFiltersIds?.length
          ? await this.seoFilterRepo.findBy({ id: In(seoFiltersIds) })
          : []
        product.seo_filters = seoFilterEntities
      }

      const parameters = dto.parameters !== undefined ? dto.parameters : undefined
      if (parameters !== undefined) {
        const ids = Array.isArray(parameters) ? parameters.map((p) => (typeof p === 'number' ? p : p.id)) : []
        const paramEntities = ids.length ? await this.parameterRepo.findBy({ id: In(ids) }) : []
        product.parameters = paramEntities
      }

      const formatGroupIds: number[] | undefined =
        dto.format_group !== undefined && Array.isArray(dto.format_group) ? dto.format_group : undefined
      if (formatGroupIds !== undefined) {
        const formatGroups = formatGroupIds.length ? await this.formatGroupRepo.findBy({ id: In(formatGroupIds) }) : []
        if (formatGroups.length !== (formatGroupIds || []).length) {
          throw new BadRequestException('format_group is NOT_FOUND')
        }
        product.format_groups = formatGroups
      }

      this.logger.log(
        `[SAVE DEBUG] Product before save - start_at: ${String(product.start_at)}, end_at: ${String(product.end_at)}`
      )
      const saved = await this.productRepo.save(product)
      this.logger.log(
        `[SAVE DEBUG] Product after save - start_at: ${String(saved.start_at)}, end_at: ${String(saved.end_at)}`
      )
      return saved
    } catch (err) {
      this.logger.error(`Error while updating product \n ${err}`)
      throw new BadRequestException('product is NOT_UPDATED')
    }
  }

  async updateParameters(id: number, dto: ProductParametersDto): Promise<Product | null> {
    const product = await this.productRepo.findOne({ where: { id } })
    if (!product) throw new NotFoundException('product is NOT_FOUND')

    try {
      const parameters = await this.parameterRepo.findBy({
        id: In(dto.parameters),
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
        relations: ['category_id', 'parent_id', 'images', 'translates', 'parameters', 'format_groups', 'ratings'],
      })) as Product
    } catch (err) {
      this.logger.error(`Error while fetching product with id ${id}: ${err}`)
      throw new BadRequestException('Failed to fetch product after updating parameters SERVER_ERROR')
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

  async createTranslates(dto: ProductCreateTranslateDto[]): Promise<ProductTranslate[] | null> {
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

  async updateTranslates(dto: ProductUpdateTranslateDto[]): Promise<ProductTranslate[] | null> {
    const results: ProductTranslate[] = []

    for (const translate of dto) {
      const result = await this.entityTranslateRepo.update(translate.id, {
        ...translate,
      })

      if (result.affected === 0) throw new NotFoundException('product translate is NOT_FOUND')

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
      throw new NotFoundException('product translate is NOT_FOUND')
    }

    return { message: 'OK' }
  }

  async createImage(dto: ProductCreateImageDto): Promise<ProductImage> {
    const entity_id = typeof dto.entity_id === 'number' ? { id: dto.entity_id } : dto.entity_id

    const newImage = this.entityImageRepo.create({
      ...dto,
      entity_id,
    })
    try {
      return await this.entityImageRepo.save(newImage)
    } catch (err) {
      this.logger.error(`Error while saving product image: ${err}`)
      throw new BadRequestException('product image is NOT_CREATED')
    }
  }

  async addImage(productId: number, dto: AddProductImageDto): Promise<{ message: string }> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    })

    if (!product) throw new NotFoundException('product is NOT_FOUND')

    const newImage = this.entityImageRepo.create({
      entity_id: product,
      path: dto.path,
      name: dto.path.split('/').pop() || 'image',
    })

    try {
      await this.entityImageRepo.save(newImage)
      return { message: 'Image added successfully' }
    } catch (err) {
      this.logger.error(`Error adding image to product: ${err}`)
      throw new BadRequestException('Image not added')
    }
  }

  async deleteImage(id: number): Promise<void> {
    const image = await this.entityImageRepo.findOne({ where: { id } })

    if (!image) throw new NotFoundException('product image is NOT_FOUND')

    await this.entityImageRepo.delete(id)
  }

  async deleteImages(productId: number): Promise<void> {
    const images = await this.entityImageRepo.find({
      where: { entity_id: { id: productId } },
    })

    if (images.length > 0) {
      await this.entityImageRepo.remove(images)
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

    try {
      // Delete database records
      await this.entityImageRepo.delete(ids)
    } catch (err) {
      this.logger.error(`Failed to delete image records: ${err}`)
      throw new BadRequestException('Failed to delete images')
    }

    return { message: 'Images deleted successfully' }
  }

  async searchShort(q: string) {
    if (!q || q.length < 1) return []

    try {
      return await this.productRepo
        .createQueryBuilder('product')
        .select(['product.id', 'product.title'])
        .where('LOWER(product.title) LIKE :q', { q: `%${q.toLowerCase()}%` })
        .orderBy('product.created_at', 'DESC')
        .limit(20)
        .getMany()
    } catch (err) {
      this.logger.error(`Error in searchShort: ${err}`)
      throw new BadRequestException({
        message: 'SEARCH_FAILED',
        code: 'SEARCH_FAILED',
      })
    }
  }

  async getImagesByProduct(productId: number): Promise<ProductImage[]> {
    const product = await this.productRepo.findOne({ where: { id: productId } })

    if (!product) throw new NotFoundException('product is NOT_FOUND')

    const images = await this.entityImageRepo.find({
      where: { entity_id: { id: productId } },
      order: { order: 'ASC' },
    })

    return images
  }

  async updateRecommendedProducts(id: number, productIds: number[]): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['recommendedProducts'],
    })

    if (!product) throw new NotFoundException('product is NOT_FOUND')

    const recommended =
      Array.isArray(productIds) && productIds.length ? await this.productRepo.findBy({ id: In(productIds) }) : []

    product.recommendedProducts = recommended

    try {
      await this.productRepo.save(product)
    } catch (err) {
      this.logger.error(`Error while updating recommended products \n ${err}`)
      throw new BadRequestException('product is NOT_UPDATED')
    }

    const updated = await this.productRepo.findOne({
      where: { id },
      relations: [
        'recommendedProducts',
        'recommendedProducts.images',
        'recommendedProducts.translates',
        'recommendedProducts.category_id',
      ],
    })

    return updated as Product
  }

  async getRecommendedOfProduct(id: number, lang: LANG): Promise<Product[]> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: [
        'recommendedProducts',
        'recommendedProducts.images',
        'recommendedProducts.translates',
        'recommendedProducts.category_id',
        'recommendedProducts.category_id.translates',
      ],
    })

    if (!product) throw new NotFoundException('product is NOT_FOUND')

    const recs = product.recommendedProducts || []

    let mapped = applyTranslations(recs, lang)

    mapped = mapped.map((p) => {
      if (p.category_id && p.category_id.translates) {
        p.category_id = applyTranslations([p.category_id], lang)[0]
      }
      return p
    })

    return mapped
  }
}
