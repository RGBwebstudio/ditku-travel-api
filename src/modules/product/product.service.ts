import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Request } from 'express'
import { LANG } from 'src/common/enums/translation.enum'
import { ProductWithoutRatings } from 'src/common/utils/apply-rating'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { flattenTranslations } from 'src/common/utils/flatten-translates.util'
import { Category } from 'src/modules/category/entities/category.entity'
import { Faq } from 'src/modules/faq/entities/faq.entity'
import { FormatGroup } from 'src/modules/format-group/entities/format-group.entity'
import { Parameter } from 'src/modules/parameter/entities/parameter.entity'
import { Post } from 'src/modules/posts/entities/post.entity'
import { ProductCreateDto } from 'src/modules/product/dto/product-create.dto'
import { Rating } from 'src/modules/product-rating/entities/rating.entity'
import { Roadmap } from 'src/modules/roadmap/entities/roadmap.entity'
import { Section } from 'src/modules/section/entities/section.entity'
import { SeoFilter } from 'src/modules/seo-filter/entities/seo-filter.entity'
import { Repository, In, DeepPartial } from 'typeorm'

import { AddProductImageDto } from './dto/add-product-image.dto'
import { CreateProgramDto } from './dto/create-program.dto'
import { ProductCreateImageDto } from './dto/product-create-image.dto'
import { ProductCreateTranslateDto } from './dto/product-create-translate.dto'
import { ProductParametersDto } from './dto/product-parameters.dto'
import { ProductUpdateTranslateDto } from './dto/product-update-translate.dto'
import { ProductUpdateDto } from './dto/product-update.dto'
import { UpdateProgramDto } from './dto/update-program.dto'
import { ProductImage } from './entities/product-image.entity'
import { ProductProgramImage } from './entities/product-program-image.entity'
import { ProductProgramTranslate } from './entities/product-program-translate.entity'
import { ProductProgram } from './entities/product-program.entity'
import { ProductSectionTranslate } from './entities/product-section-translate.entity'
import { ProductSection } from './entities/product-section.entity'
import { ProductTranslate } from './entities/product-translate.entity'
import { Product } from './entities/product.entity'

type RawRoadmap = Roadmap

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name)

  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Parameter) private parameterRepo: Repository<Parameter>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Section) private sectionRepo: Repository<Section>,
    @InjectRepository(Faq) private faqRepo: Repository<Faq>,
    @InjectRepository(FormatGroup)
    private formatGroupRepo: Repository<FormatGroup>,
    @InjectRepository(ProductTranslate)
    private entityTranslateRepo: Repository<ProductTranslate>,
    @InjectRepository(ProductImage)
    private entityImageRepo: Repository<ProductImage>,
    @InjectRepository(SeoFilter)
    private seoFilterRepo: Repository<SeoFilter>,
    @InjectRepository(ProductProgram)
    private programRepo: Repository<ProductProgram>,
    @InjectRepository(ProductProgramImage)
    private programImageRepo: Repository<ProductProgramImage>,
    @InjectRepository(ProductProgramTranslate)
    private programTranslateRepo: Repository<ProductProgramTranslate>,
    @InjectRepository(Rating)
    private ratingRepo: Repository<Rating>,

    @InjectRepository(ProductSection)
    private productSectionRepo: Repository<ProductSection>,
    @InjectRepository(ProductSectionTranslate)
    private productSectionTranslateRepo: Repository<ProductSectionTranslate>,
    @InjectRepository(Post)
    private postRepo: Repository<Post>
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
          item && item.translates ? flattenTranslations([item], lang)[0] : item
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

      if (product.format_groups && Array.isArray(product.format_groups)) {
        product.format_groups = product.format_groups.map((item) =>
          item && item.translates ? flattenTranslations([item], lang)[0] : item
        )
      }
    }

    return mappedEntities
  }

  async findClosestTours(lang: LANG): Promise<ProductWithoutRatings[]> {
    const result = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category_id', 'category_id')
      .leftJoinAndSelect('category_id.translates', 'category_translates')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.translates', 'translates')
      .addSelect(
        (subQuery) =>
          subQuery.select('COALESCE(AVG(r.rating), 0)').from('rating', 'r').where('r.productIdId = product.id'),
        'average_rating'
      )
      .where('product.show_on_main_page = :showOnMainPage', { showOnMainPage: true })
      .andWhere('product.is_hidden = :isHidden', { isHidden: false })
      .orderBy('product.start_at', 'ASC')
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
    }

    return mappedEntities
  }

  async findTopFiltered(lang: LANG): Promise<ProductWithoutRatings[]> {
    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category_id', 'category_id')
      .leftJoinAndSelect('category_id.translates', 'category_translates')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.translates', 'translates')
      .where('product.is_hidden = :isHidden', { isHidden: false })
      .andWhere('product.is_top = :isTop', { isTop: true })

    const products = await queryBuilder.orderBy('product.created_at', 'DESC').take(20).getMany()

    const mappedEntities = applyTranslations(products, lang)

    for (const product of mappedEntities) {
      if (product.category_id && product.category_id.translates) {
        product.category_id = applyTranslations([product.category_id], lang)[0]
      }
    }

    return mappedEntities
  }

  async find(take: number, skip: number, lang: LANG): Promise<{ entities: ProductWithoutRatings[]; count: number }> {
    const result = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category_id', 'category_id')
      .leftJoinAndSelect('product.format_groups', 'format_groups')
      .leftJoinAndSelect('format_groups.translates', 'format_groups_translates')
      .leftJoinAndSelect('category_id.translates', 'category_translates')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.translates', 'translates')
      .leftJoinAndSelect('product.seo_filters', 'seo_filters')
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

      if (product.format_groups && Array.isArray(product.format_groups)) {
        product.format_groups = product.format_groups.map((item) =>
          item && item.translates ? flattenTranslations([item], lang)[0] : item
        )
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

      if (product.format_groups && Array.isArray(product.format_groups)) {
        product.format_groups = product.format_groups.map((item) =>
          item && item.translates ? flattenTranslations([item], lang)[0] : item
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
    endAt?: string,
    seoFilterId?: number | string,
    is_popular?: boolean,
    show_in_popular_on_main_page?: boolean
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
      .leftJoinAndSelect('category_id.translates', 'category_translates')
      .where('product.is_hidden = :isHidden', { isHidden: false })

    if (is_popular !== undefined) {
      const isPopularBool = String(is_popular) === 'true'
      if (isPopularBool) {
        queryBuilder.andWhere('product.is_popular = :isPopular', {
          isPopular: true,
        })
      }
    }

    if (show_in_popular_on_main_page !== undefined) {
      const showInPopularBool = String(show_in_popular_on_main_page) === 'true'
      if (showInPopularBool) {
        queryBuilder.andWhere('product.show_in_popular_on_main_page = :showInPopular', {
          showInPopular: true,
        })
      }
    }

    // SEO Filter support
    if (seoFilterId) {
      if (typeof seoFilterId === 'number' || (typeof seoFilterId === 'string' && !isNaN(Number(seoFilterId)))) {
        const id = Number(seoFilterId)
        queryBuilder.andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('psf.product_id')
            .from('product_seo_filters', 'psf')
            .where('psf.seo_filter_id = :seoFilterId', { seoFilterId: id })
            .getQuery()
          return 'product.id IN ' + subQuery
        })
      } else if (typeof seoFilterId === 'string') {
        const slug = seoFilterId
        queryBuilder.innerJoin('product.seo_filters', 'filter_join')
        queryBuilder.andWhere('filter_join.url = :seoFilterUrl', {
          seoFilterUrl: slug,
        })
      }
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

      if (product.format_groups && Array.isArray(product.format_groups)) {
        product.format_groups = product.format_groups.map((item) =>
          item && item.translates ? flattenTranslations([item], lang)[0] : item
        )
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
          item && item.translates ? flattenTranslations([item], lang)[0] : item
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
    // Query 1: Load product with basic relations (no roadmaps)
    const product = await this.productRepo.findOne({
      where: { id },
      relations: [
        'category_id',
        'category_id.translates',
        'parent_id',
        'images',
        'translates',
        'format_groups',
        'format_groups.translates',
        'sections',
        'sections.translates',
        'parameters',
        'parameters.translates',
        'seo_filters',
      ],
    })

    if (!product) throw new NotFoundException('product is NOT_FOUND')

    // Query 2: Load heavy relations in parallel (roadmaps, programs, reviews, blogs, sections, faqs)
    const [roadmaps, programs, reviews, productSections, faqs] = await Promise.all([
      this.productRepo.manager
        .getRepository(Roadmap)
        .createQueryBuilder('r')
        .leftJoinAndSelect('r.translates', 't')
        .leftJoinAndSelect('r.city_id', 'city')
        .leftJoinAndSelect('city.translates', 'city_t')
        .where('r.product_id = :productId', { productId: product.id })
        .orderBy('r.order', 'ASC')
        .getMany(),
      this.programRepo
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.images', 'images')
        .leftJoinAndSelect('p.translates', 'translates')
        .where('p.product_id = :productId', { productId: product.id })
        .orderBy('p.order_in_list', 'ASC')
        .addOrderBy('p.day', 'ASC')
        .getMany(),
      this.ratingRepo
        .createQueryBuilder('r')
        .leftJoinAndSelect('r.translates', 'translates')
        .where('r.product_id = :productId', { productId: product.id })
        .andWhere('r.approved = :approved', { approved: true })
        .orderBy('r.created_at', 'DESC')
        .getMany(),

      this.productSectionRepo.find({
        where: { product_id: { id: product.id } },
        relations: ['translates'],
        order: { order: 'ASC' },
      }),
      this.productRepo.createQueryBuilder().relation(Product, 'faqs').of(product.id).loadMany(),
    ])

    product.roadmaps = roadmaps
    product.programs = programs
    product.ratings = reviews

    product.productSections = productSections
    product.faqs = faqs

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
          item && item.translates ? flattenTranslations([item], lang)[0] : item
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

    // Apply translations to programs
    const mappedPrograms = applyTranslations(programs || [], lang)
    ;(mappedProductDto as any).programs = mappedPrograms.map((program: ProductProgram) => ({
      id: program.id,
      day: program.day,
      title: program.title,
      description: program.description,
      order: program.order,
      images: (program.images || [])
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((img) => ({
          id: img.id,
          url: img.url,
          path: img.path,
          order: img.order,
        })),
      translates: program.translates,
    }))

    // Apply translations to reviews and calculate stats
    const mappedReviews = applyTranslations(reviews || [], lang)
    const totalRating = reviews.reduce((sum: number, r: Rating) => sum + Number(r.rating), 0)
    const averageRating = reviews.length > 0 ? Math.round((totalRating / reviews.length) * 10) / 10 : 0

    ;(mappedProductDto as any).reviews = {
      items: mappedReviews.map((review: Rating) => ({
        id: review.id,
        name: review.name,
        rating: Number(review.rating),
        review: review.review,
        created_at: review.created_at,
        translates: review.translates,
      })),
      average_rating: averageRating,
      total_count: reviews.length,
    }

    // Map productSections to sections field for frontend (product content sections)
    if (product.productSections && product.productSections.length) {
      const mappedSections = applyTranslations(product.productSections, lang)
      // Sort by order and include all fields
      ;(mappedProductDto as any).sections = mappedSections
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
        .map((s: any) => ({
          id: s.id,
          type: s.type,
          order: s.order,
          title: s.title,
          description: s.description,
          images: s.images || [],
          banner1_title: s.banner1_title,
          banner1_button_text: s.banner1_button_text,
          banner1_link: s.banner1_link,
          banner2_title: s.banner2_title,
          banner2_button_text: s.banner2_button_text,
          banner2_link: s.banner2_link,

          translates: s.translates,
          badge: s.badge,
        }))
    }

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
    // Query 1: Load product with basic relations (no roadmaps)
    const product = await this.productRepo.findOne({
      where: { url },
      relations: [
        'category_id',
        'category_id.translates',
        'parent_id',
        'images',
        'translates',
        'format_groups',
        'format_groups.translates',
        'sections',
        'sections.translates',
        'parameters',
        'parameters.translates',
        'seo_filters',
      ],
    })

    if (!product) throw new NotFoundException('product is NOT_FOUND')

    const [roadmaps, programs, reviews, children, faqs, productSections] = await Promise.all([
      // Query 2: Load roadmaps with city data
      this.productRepo.manager
        .getRepository(Roadmap)
        .createQueryBuilder('r')
        .leftJoinAndSelect('r.translates', 't')
        .leftJoinAndSelect('r.city_id', 'city')
        .leftJoinAndSelect('city.translates', 'city_t')
        .where('r.product_id = :productId', { productId: product.id })
        .orderBy('r.order', 'ASC')
        .getMany(),
      // Query 3: Load programs with images and translations
      this.programRepo
        .createQueryBuilder('p')
        .leftJoinAndSelect('p.images', 'images')
        .leftJoinAndSelect('p.translates', 'translates')
        .where('p.product_id = :productId', { productId: product.id })
        .orderBy('p.order_in_list', 'ASC')
        .addOrderBy('p.day', 'ASC')
        .getMany(),
      // Query 4: Load reviews (approved only)
      this.ratingRepo
        .createQueryBuilder('r')
        .leftJoinAndSelect('r.translates', 'translates')
        .where('r.product_id = :productId', { productId: product.id })
        .andWhere('r.approved = :approved', { approved: true })
        .orderBy('r.created_at', 'DESC')
        .getMany(),
      // Query 5: Load children
      this.productRepo.find({
        where: { parent_id: { id: product.id } },
        relations: ['category_id', 'images', 'translates'],
      }),
      // Query 6: Load FAQs
      this.productRepo.createQueryBuilder().relation(Product, 'faqs').of(product.id).loadMany(),
      // Query 7: Load Product Sections
      this.productSectionRepo.find({
        where: { product_id: { id: product.id } },
        relations: ['translates'],
        order: { order: 'ASC' },
      }),
    ])

    product.roadmaps = roadmaps
    product.programs = programs
    product.faqs = faqs
    product.productSections = productSections

    // Track viewed products in session
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

      if (prod.format_groups && Array.isArray(prod.format_groups)) {
        prod.format_groups = prod.format_groups.map((item) =>
          item && item.translates ? flattenTranslations([item], lang)[0] : item
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

    // Apply translations to programs
    const mappedPrograms = applyTranslations(programs || [], lang)
    ;(pickedMappedProduct as any).programs = mappedPrograms.map((program: ProductProgram) => ({
      id: program.id,
      day: program.day,
      title: program.title,
      description: program.description,
      order: program.order,
      images: (program.images || [])
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((img) => ({
          id: img.id,
          url: img.url,
          path: img.path,
          order: img.order,
        })),
      translates: program.translates,
    }))

    // Apply translations to reviews and calculate stats
    const mappedReviews = applyTranslations(reviews || [], lang)
    const totalRating = reviews.reduce((sum: number, r: Rating) => sum + Number(r.rating), 0)
    const averageRating = reviews.length > 0 ? Math.round((totalRating / reviews.length) * 10) / 10 : 0

    ;(pickedMappedProduct as any).reviews = {
      items: mappedReviews.map((review: Rating) => ({
        id: review.id,
        name: review.name,
        rating: Number(review.rating),
        review: review.review,
        created_at: review.created_at,
        translates: review.translates,
      })),
      average_rating: averageRating,
      total_count: reviews.length,
    }

    // Batch query for all child ratings (avoids N+1 problem)
    let mappedChildren: Product[] = []
    if (children.length > 0) {
      const childIds = children.map((c) => c.id)
      const ratingsResult = await this.productRepo
        .createQueryBuilder()
        .select('r.productIdId', 'productId')
        .addSelect('COALESCE(AVG(r.rating), 0)', 'averageRating')
        .from('rating', 'r')
        .where('r.productIdId IN (:...childIds)', { childIds })
        .groupBy('r.productIdId')
        .getRawMany()

      const ratingsMap = new Map<number, number>()
      for (const r of ratingsResult) {
        ratingsMap.set(Number(r.productId), parseFloat(r.averageRating) || 0)
      }

      for (const child of children) {
        child.rating = ratingsMap.get(child.id) || 0
      }

      mappedChildren = applyTranslations(children, lang)

      mappedChildren = mappedChildren.map((child) => {
        if (child.category_id && child.category_id.translates) {
          child.category_id = applyTranslations([child.category_id], lang)[0]
        }

        if (child.format_groups && Array.isArray(child.format_groups)) {
          child.format_groups = child.format_groups.map((item) =>
            item && item.translates ? flattenTranslations([item], lang)[0] : item
          )
        }

        return child
      })
    }

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

    // Filter sections to separate IDs (numbers) from objects (productSections)
    let sectionsIds: number[] | undefined = undefined
    let productSectionObjects: any[] | undefined = undefined

    if (Array.isArray(dto.sections)) {
      if (dto.sections.length === 0) {
        // Empty array - no sections
        sectionsIds = []
      } else if (typeof dto.sections[0] === 'object') {
        // These are product section objects
        productSectionObjects = dto.sections
      } else {
        // These are global section IDs
        sectionsIds = dto.sections.filter((s): s is number => typeof s === 'number')
      }
    }

    // Also check for explicit productSections field
    if (!productSectionObjects && Array.isArray(dto.productSections) && dto.productSections.length > 0) {
      productSectionObjects = dto.productSections
    }

    if (dto.sections) delete productPayload.sections
    if ((productPayload as any).productSections) delete (productPayload as any).productSections

    const formatGroupIds: number[] | undefined =
      Array.isArray(dto.format_group) && dto.format_group.length ? dto.format_group : undefined
    if (formatGroupIds) delete productPayload.format_group

    const seoFiltersIds = Array.isArray(dto.seo_filters) ? dto.seo_filters : undefined
    if (seoFiltersIds) delete productPayload.seo_filters

    const faqIds = Array.isArray(dto.faq_ids) ? dto.faq_ids : undefined
    if (faqIds) delete productPayload.faq_ids

    const recommendedIds = Array.isArray(dto.recommended_ids) ? dto.recommended_ids : undefined
    if (recommendedIds) delete productPayload.recommended_ids

    const blogIds = Array.isArray(dto.blog_ids) ? dto.blog_ids : undefined
    if (blogIds) delete productPayload.blog_ids

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

      if (faqIds && faqIds.length) {
        const faqs = await this.faqRepo.findBy({
          id: In(faqIds),
        })
        saved.faqs = faqs
        await this.productRepo.save(saved)
      }

      if (recommendedIds && recommendedIds.length) {
        const recommendedProducts = await this.productRepo.findBy({
          id: In(recommendedIds),
        })
        saved.recommendedProducts = recommendedProducts
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

      if (blogIds && blogIds.length) {
        const posts = await this.postRepo.findBy({
          id: In(blogIds),
        })
        saved.posts = posts
        await this.productRepo.save(saved)
      }

      if (sectionsIds && sectionsIds.length) {
        const sectionEntities = await this.sectionRepo.findBy({
          id: In(sectionsIds),
        })
        saved.sections = sectionEntities.length ? sectionEntities : []
        await this.productRepo.save(saved)
      }

      // Handle productSections creation (content blocks)
      if (productSectionObjects && productSectionObjects.length > 0) {
        for (const sectionDto of productSectionObjects) {
          let sectionEntity = this.productSectionRepo.create({
            type: sectionDto.type || 'content',
            order: sectionDto.order ?? 0,
            title: sectionDto.title || sectionDto.title_ua || '',
            description: sectionDto.description || sectionDto.description_ua || '',
            images: sectionDto.images || [],
            banner1_title: sectionDto.banner1_title_ua,
            banner1_button_text: sectionDto.banner1_button_text_ua,
            banner1_link: sectionDto.banner1_link_ua,
            banner2_title: sectionDto.banner2_title_ua,
            banner2_button_text: sectionDto.banner2_button_text_ua,
            banner2_link: sectionDto.banner2_link_ua,

            badge: sectionDto.badge_ua,
            product_id: saved,
          })

          sectionEntity = await this.productSectionRepo.save(sectionEntity)

          // Handle translations for this section
          const sectionTranslateFields = [
            'title',
            'description',
            'banner1_title',
            'banner1_button_text',
            'banner1_link',
            'banner2_title',
            'banner2_button_text',
            'banner2_link',
            'badge',
          ]

          // Create translations
          for (const field of sectionTranslateFields) {
            const uaValue = sectionDto[`${field}_ua`]
            const enValue = sectionDto[`${field}_en`]

            if (uaValue) {
              const translateUA = this.productSectionTranslateRepo.create({
                field,
                value: uaValue,
                lang: LANG.UA,
                entity_id: sectionEntity,
              })
              await this.productSectionTranslateRepo.save(translateUA)
            }

            if (enValue) {
              const translateEN = this.productSectionTranslateRepo.create({
                field,
                value: enValue,
                lang: LANG.EN,
                entity_id: sectionEntity,
              })
              await this.productSectionTranslateRepo.save(translateEN)
            }
          }
        }
      }

      return saved
    } catch (err) {
      this.logger.error(`Error while creating product: ${err?.message || err}`)
      this.logger.error(err?.stack || err)
      throw new BadRequestException(`product is NOT_CREATED: ${err?.message || 'Unknown error'}`)
    }
  }

  async update(id: number, dto: ProductUpdateDto): Promise<Product | null> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['sections', 'seo_filters', 'parameters', 'format_groups', 'faqs'],
    })

    if (!product) throw new NotFoundException('product is NOT_FOUND')

    try {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const {
        sections,
        format_group,
        seo_filters,
        faq_ids,
        recommended_ids,
        blog_ids,

        productSections,
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

      Object.assign(product, updatePayload)

      const sectionsFromDto = dto.sections
      let globalSectionIds: number[] | undefined = undefined
      let productSectionObjects: any[] | undefined = undefined

      if (sectionsFromDto !== undefined && Array.isArray(sectionsFromDto)) {
        if (sectionsFromDto.length === 0) {
          productSectionObjects = []
        } else if (typeof sectionsFromDto[0] === 'object') {
          productSectionObjects = sectionsFromDto
        } else {
          globalSectionIds = sectionsFromDto.filter((id): id is number => typeof id === 'number')
        }
      }

      if (globalSectionIds !== undefined) {
        const sectionEntities =
          globalSectionIds.length > 0 ? await this.sectionRepo.findBy({ id: In(globalSectionIds) }) : []
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

      const faqIds: number[] | undefined = Array.isArray(faq_ids) ? faq_ids : undefined
      if (faqIds !== undefined) {
        const faqs = faqIds.length ? await this.faqRepo.findBy({ id: In(faqIds) }) : []
        product.faqs = faqs
      }

      const recommendedIds: number[] | undefined = Array.isArray(recommended_ids) ? recommended_ids : undefined
      if (recommendedIds !== undefined) {
        const recommendedProducts = recommendedIds.length
          ? await this.productRepo.findBy({ id: In(recommendedIds) })
          : []
        product.recommendedProducts = recommendedProducts
      }

      const blogIds: number[] | undefined = Array.isArray(blog_ids) ? blog_ids : undefined
      if (blogIds !== undefined) {
        const posts = blogIds.length ? await this.postRepo.findBy({ id: In(blogIds) }) : []
        product.posts = posts
      }

      const sectionObjectsToProcess =
        productSectionObjects ||
        (productSections !== undefined && Array.isArray(productSections) ? productSections : undefined)

      if (sectionObjectsToProcess && sectionObjectsToProcess.length >= 0) {
        const existingSections = await this.productSectionRepo.find({
          where: { product_id: { id: product.id } },
          relations: ['translates'],
        })

        const incomingIds = sectionObjectsToProcess.filter((s) => s.id).map((s) => s.id as number)

        const sectionsToDelete = existingSections.filter((es) => !incomingIds.includes(es.id))
        if (sectionsToDelete.length > 0) {
          await this.productSectionRepo.remove(sectionsToDelete)
        }

        for (const sectionDto of sectionObjectsToProcess) {
          let sectionEntity: ProductSection

          if (sectionDto.id) {
            sectionEntity = existingSections.find((es) => es.id === sectionDto.id) || new ProductSection()
            sectionEntity.type = sectionDto.type || sectionEntity.type || 'content'
            sectionEntity.order = sectionDto.order ?? sectionEntity.order ?? 0
            sectionEntity.title = sectionDto.title || sectionEntity.title || ''
            sectionEntity.description = sectionDto.description || sectionEntity.description || ''
            sectionEntity.images = sectionDto.images || sectionEntity.images || []
            sectionEntity.banner1_title = sectionDto.banner1_title_ua || sectionEntity.banner1_title
            sectionEntity.banner1_button_text = sectionDto.banner1_button_text_ua || sectionEntity.banner1_button_text
            sectionEntity.banner1_link = sectionDto.banner1_link_ua || sectionEntity.banner1_link
            sectionEntity.banner2_title = sectionDto.banner2_title_ua || sectionEntity.banner2_title
            sectionEntity.banner2_button_text = sectionDto.banner2_button_text_ua || sectionEntity.banner2_button_text
            sectionEntity.banner2_link = sectionDto.banner2_link_ua || sectionEntity.banner2_link
            sectionEntity.badge = sectionDto.badge_ua || sectionEntity.badge

            await this.productSectionRepo.save(sectionEntity)
          } else {
            sectionEntity = this.productSectionRepo.create({
              type: sectionDto.type || 'content',
              order: sectionDto.order ?? 0,
              title: sectionDto.title || sectionDto.title_ua || '',
              description: sectionDto.description || sectionDto.description_ua || '',
              images: sectionDto.images || [],
              banner1_title: sectionDto.banner1_title_ua,
              banner1_button_text: sectionDto.banner1_button_text_ua,
              banner1_link: sectionDto.banner1_link_ua,
              banner2_title: sectionDto.banner2_title_ua,
              banner2_button_text: sectionDto.banner2_button_text_ua,
              banner2_link: sectionDto.banner2_link_ua,
              badge: sectionDto.badge_ua,
              product_id: product,
            })

            sectionEntity = await this.productSectionRepo.save(sectionEntity)
          }

          const sectionTranslateFields = [
            'title',
            'description',
            'banner1_title',
            'banner1_button_text',
            'banner1_link',
            'banner2_title',
            'banner2_button_text',
            'banner2_link',
            'badge',
          ]

          if (sectionEntity.id) {
            await this.productSectionTranslateRepo.delete({ entity_id: { id: sectionEntity.id } })
          }

          for (const field of sectionTranslateFields) {
            const uaValue = sectionDto[`${field}_ua`]
            const enValue = sectionDto[`${field}_en`]

            if (uaValue) {
              const translateUA = this.productSectionTranslateRepo.create({
                field,
                value: uaValue,
                lang: LANG.UA,
                entity_id: sectionEntity,
              })
              await this.productSectionTranslateRepo.save(translateUA)
            }

            if (enValue) {
              const translateEN = this.productSectionTranslateRepo.create({
                field,
                value: enValue,
                lang: LANG.EN,
                entity_id: sectionEntity,
              })
              await this.productSectionTranslateRepo.save(translateEN)
            }
          }
        }
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
      this.logger.error(`Error while updating product: ${err}`)
      if (err instanceof Error) {
        this.logger.error(`Stack: ${err.stack}`)
      }
      this.logger.error(`Full error: ${JSON.stringify(err, null, 2)}`)
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

  // ==================== PROGRAM CRUD METHODS ====================

  async getProductPrograms(productId: number, lang: LANG): Promise<any[]> {
    const product = await this.productRepo.findOne({ where: { id: productId } })
    if (!product) throw new NotFoundException('product is NOT_FOUND')

    const programs = await this.programRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.images', 'images')
      .leftJoinAndSelect('p.translates', 'translates')
      .where('p.product_id = :productId', { productId })
      .orderBy('p.order_in_list', 'ASC')
      .addOrderBy('p.day', 'ASC')
      .getMany()

    const mappedPrograms = applyTranslations(programs, lang)

    return mappedPrograms.map((program) => ({
      id: program.id,
      day: program.day,
      title: program.title,
      description: program.description,
      order: program.order,
      images: (program.images || [])
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((img) => ({
          id: img.id,
          url: img.url,
          path: img.path,
          order: img.order,
        })),
      translates: program.translates,
    }))
  }

  async createProgram(productId: number, dto: CreateProgramDto): Promise<ProductProgram> {
    const product = await this.productRepo.findOne({ where: { id: productId } })
    if (!product) throw new NotFoundException('product is NOT_FOUND')

    try {
      const program = this.programRepo.create({
        day: dto.day,
        title: dto.title,
        description: dto.description || '',
        order: dto.order || 0,
        product_id: product,
      })

      const saved = await this.programRepo.save(program)

      // Create images if provided
      if (dto.images && dto.images.length > 0) {
        const images = dto.images.map((img, index) =>
          this.programImageRepo.create({
            url: img.url,
            path: img.path,
            order: img.order ?? index,
            program_id: saved,
          })
        )
        await this.programImageRepo.save(images)
      }

      // Create translations if provided
      if (dto.translates && dto.translates.length > 0) {
        const translates = dto.translates.map((t) =>
          this.programTranslateRepo.create({
            lang: t.lang,
            field: t.field,
            value: t.value,
            entity_id: saved,
          })
        )
        await this.programTranslateRepo.save(translates)
      }

      // Return with relations
      return (await this.programRepo.findOne({
        where: { id: saved.id },
        relations: ['images', 'translates'],
      })) as ProductProgram
    } catch (err) {
      this.logger.error(`Error creating program: ${err}`)
      throw new BadRequestException('program is NOT_CREATED')
    }
  }

  async updateProgram(programId: number, dto: UpdateProgramDto): Promise<ProductProgram> {
    const program = await this.programRepo.findOne({
      where: { id: programId },
      relations: ['images', 'translates'],
    })

    if (!program) throw new NotFoundException('program is NOT_FOUND')

    try {
      // Update scalar fields
      if (dto.day !== undefined) program.day = dto.day
      if (dto.title !== undefined) program.title = dto.title
      if (dto.description !== undefined) program.description = dto.description
      if (dto.order !== undefined) program.order = dto.order

      await this.programRepo.save(program)

      // Update images if provided
      if (dto.images !== undefined) {
        // Delete existing images
        await this.programImageRepo.delete({ program_id: { id: programId } })

        // Create new images
        if (dto.images.length > 0) {
          const images = dto.images.map((img, index) =>
            this.programImageRepo.create({
              url: img.url,
              path: img.path,
              order: img.order ?? index,
              program_id: program,
            })
          )
          await this.programImageRepo.save(images)
        }
      }

      // Update translations if provided
      if (dto.translates !== undefined) {
        // Delete existing translations
        await this.programTranslateRepo.delete({ entity_id: { id: programId } })

        // Create new translations
        if (dto.translates.length > 0) {
          const translates = dto.translates.map((t) =>
            this.programTranslateRepo.create({
              lang: t.lang,
              field: t.field,
              value: t.value,
              entity_id: program,
            })
          )
          await this.programTranslateRepo.save(translates)
        }
      }

      return (await this.programRepo.findOne({
        where: { id: programId },
        relations: ['images', 'translates'],
      })) as ProductProgram
    } catch (err) {
      this.logger.error(`Error updating program: ${err}`)
      throw new BadRequestException('program is NOT_UPDATED')
    }
  }

  async deleteProgram(programId: number): Promise<{ message: string }> {
    const result = await this.programRepo.delete(programId)

    if (result.affected === 0) {
      throw new NotFoundException('program is NOT_FOUND')
    }

    return { message: 'SUCCESS' }
  }

  async updateProductPrograms(
    productId: number,
    programs: (CreateProgramDto | UpdateProgramDto)[]
  ): Promise<ProductProgram[]> {
    const product = await this.productRepo.findOne({ where: { id: productId } })
    if (!product) throw new NotFoundException('product is NOT_FOUND')

    try {
      // Get existing programs
      const existingPrograms = await this.programRepo.find({
        where: { product_id: { id: productId } },
      })

      const existingIds = existingPrograms.map((p) => p.id)
      const incomingIds = programs.filter((p) => (p as UpdateProgramDto).id).map((p) => (p as UpdateProgramDto).id!)

      // Delete programs that are not in the incoming list
      const toDelete = existingIds.filter((id) => !incomingIds.includes(id))
      if (toDelete.length > 0) {
        await this.programRepo.delete(toDelete)
      }

      const result: ProductProgram[] = []

      for (const programDto of programs) {
        if ((programDto as UpdateProgramDto).id) {
          // Update existing program
          const updated = await this.updateProgram((programDto as UpdateProgramDto).id!, programDto as UpdateProgramDto)
          result.push(updated)
        } else {
          // Create new program
          const created = await this.createProgram(productId, programDto as CreateProgramDto)
          result.push(created)
        }
      }

      return result
    } catch (err) {
      this.logger.error(`Error updating product programs: ${err}`)
      throw new BadRequestException('programs are NOT_UPDATED')
    }
  }

  async addProgramImage(
    programId: number,
    dto: { url?: string; path?: string; order?: number }
  ): Promise<{ message: string }> {
    const program = await this.programRepo.findOne({ where: { id: programId } })
    if (!program) throw new NotFoundException('program is NOT_FOUND')

    try {
      const image = this.programImageRepo.create({
        url: dto.url,
        path: dto.path,
        order: dto.order || 0,
        program_id: program,
      })
      await this.programImageRepo.save(image)
      return { message: 'Image added successfully' }
    } catch (err) {
      this.logger.error(`Error adding program image: ${err}`)
      throw new BadRequestException('image is NOT_CREATED')
    }
  }

  async deleteProgramImage(imageId: number): Promise<{ message: string }> {
    const result = await this.programImageRepo.delete(imageId)

    if (result.affected === 0) {
      throw new NotFoundException('program image is NOT_FOUND')
    }

    return { message: 'SUCCESS' }
  }
}
