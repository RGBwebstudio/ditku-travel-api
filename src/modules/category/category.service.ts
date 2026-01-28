import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { FineOneWhereType } from 'src/common/types/category.types'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { Category } from 'src/modules/category/entities/category.entity'
import { Post } from 'src/modules/posts/entities/post.entity'
import { Product } from 'src/modules/product/entities/product.entity'
import { Repository, TreeRepository, IsNull, FindOptionsWhere } from 'typeorm'

import { AddCategoryImageDto } from './dto/add-category-image.dto'
import { CategoryCreateImageDto } from './dto/category-create-image.dto'
import { CategoryCreateTranslateDto } from './dto/category-create-translate.dto'
import { CategoryCreateDto } from './dto/category-create.dto'
import { CategoryUpdateTranslateDto } from './dto/category-update-translate.dto'
import { CategoryUpdateDto } from './dto/category-update.dto'
import { CategoryImage } from './entities/category-image.entity'
import { CategoryTranslate } from './entities/category-translate.entity'

export interface AdditionalFilterItem {
  roadmap_id: number
  product_id: number
  product_title: string
  product_url: string
  city_id: number | null
  city_title: string | null
  time: string
  description: string
  order: number
}

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name)

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: TreeRepository<Category>,
    @InjectRepository(CategoryTranslate)
    private readonly entityTranslateRepo: Repository<CategoryTranslate>,
    @InjectRepository(CategoryImage)
    private readonly entityImageRepo: Repository<CategoryImage>
  ) {}

  async findOne(value: FineOneWhereType, lang: LANG): Promise<Category | null> {
    let where: FindOptionsWhere<Category>

    if (typeof value === 'number') {
      where = {
        id: value,
      }
    } else {
      where = {
        url: value,
      }
    }

    const entity = await this.categoryRepo.findOne({
      where,
      relations: [
        'parent',
        'parent.translates',
        'images',
        'translates',
        'popular_tours',
        'popular_tours.category_id',
        'popular_tours.images',
        'popular_tours.translates',
        'recommended_posts',
        'recommended_posts.category_id',
      ],
    })

    if (!entity) throw new NotFoundException('category is NOT_FOUND')

    const mappedEntity = applyTranslations([entity], lang)

    try {
      const productsCount = await this.categoryRepo.manager
        .getRepository('Product')
        .createQueryBuilder('p')
        .where('p.category_id = :id', { id: entity.id })
        .getCount()

      if (mappedEntity[0]) mappedEntity[0].products_count = productsCount
    } catch (err) {
      this.logger.warn('Failed to count products for category ' + entity.id + ': ' + String(err))
      if (mappedEntity[0]) mappedEntity[0].products_count = 0
    }

    if (mappedEntity[0]?.parent) {
      const [translatedParent] = applyTranslations([mappedEntity[0].parent], lang)
      mappedEntity[0].parent = translatedParent
    }

    return mappedEntity[0] as Category | null
  }

  async create(dto: CategoryCreateDto): Promise<Category> {
    let parent: Category | null = null

    if (dto.parent && typeof dto.parent === 'number') {
      parent = await this.categoryRepo.findOne({ where: { id: dto.parent } })
    }

    const url = dto.url && String(dto.url).trim() !== '' ? dto.url : undefined

    const title = dto.title ? String(dto.title).trim() : undefined
    if (title) {
      const exists = await this.categoryRepo
        .createQueryBuilder('category')
        .where('LOWER(category.title) = :title', { title: title.toLowerCase() })
        .getOne()

      if (exists) {
        throw new BadRequestException('NAME_ALREADY_RESERVED')
      }
    }

    const {
      title_ua,
      title_en,
      seo_text_ua,
      seo_text_en,
      structure,
      popular_tours_ids,
      recommended_post_ids,
      ...categoryData
    } = dto
    const translationsData: { lang: LANG; field: string; value: string }[] = []

    if (title_ua) translationsData.push({ lang: LANG.UA, field: 'title', value: title_ua })
    if (title_en) translationsData.push({ lang: LANG.EN, field: 'title', value: title_en })
    if (seo_text_ua) translationsData.push({ lang: LANG.UA, field: 'seo_text', value: seo_text_ua })
    if (seo_text_en) translationsData.push({ lang: LANG.EN, field: 'seo_text', value: seo_text_en })

    const data = this.categoryRepo.create({
      ...categoryData,
      parent,
      ...(url ? { url } : {}),
      ...(structure ? { structure } : {}),
      popular_tours: popular_tours_ids ? popular_tours_ids.map((id) => ({ id }) as Product) : [],
      recommended_posts: recommended_post_ids ? recommended_post_ids.map((id) => ({ id }) as unknown as Post) : [],
    })

    try {
      const savedCategory = await this.categoryRepo.save(data)

      if (translationsData.length > 0) {
        const translations = translationsData.map((t) => ({
          entity_id: savedCategory,
          ...t,
        }))
        await this.createTranslates(translations)
      }

      return savedCategory as unknown as Category
    } catch (err) {
      this.logger.error(`Error while creating category ${err}`)
      throw new BadRequestException('category is NOT_CREATED')
    }
  }

  async findAllList(lang: LANG): Promise<{ entities: Category[] }> {
    const entities = await this.categoryRepo.findTrees({
      relations: [
        'parent',
        'parent.translates',
        'children',
        'children.images',
        'children.translates',
        'children.seo_filters',
        'images',
        'translates',
        'seo_filters',
      ],
    })

    const applyTranslationsRecursively = (categories: Category[]): Category[] => {
      const translatedCategories = applyTranslations(categories, lang)

      for (const category of translatedCategories) {
        if (category.parent) {
          const [translatedParentCategory] = applyTranslations([category.parent], lang)
          category.parent = translatedParentCategory
        }

        if (category.seo_filters?.length) {
          category.seo_filters = applyTranslations(category.seo_filters, lang)
        }

        if (category?.children?.length) {
          category.children = applyTranslationsRecursively(category.children)
        }
      }

      return translatedCategories
    }

    const mappedEntities = applyTranslationsRecursively(entities)

    return { entities: mappedEntities }
  }

  async searchByTitle(query: string, lang: LANG): Promise<{ entities: Category[] }> {
    if (!query || query.trim().length === 0) return { entities: [] }

    let qb = this.categoryRepo
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.translates', 'translates')
      .leftJoinAndSelect('category.images', 'images')
      .where('LOWER(category.title) LIKE :title', {
        title: `%${query.toLowerCase()}%`,
      })
      .orderBy('category.created_at', 'DESC')
      .take(20)

    let result = await qb.getMany()

    if (!result.length) {
      qb = this.categoryRepo
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.translates', 'translates')
        .leftJoinAndSelect('category.images', 'images')
        .where('LOWER(translates.value) LIKE :title', {
          title: `%${query.toLowerCase()}%`,
        })
        .andWhere('translates.field = :field', { field: 'title' })
        .orderBy('category.created_at', 'DESC')
        .take(20)

      result = await qb.getMany()
    }

    const mapped = applyTranslations(result, lang)

    return { entities: mapped }
  }

  async findInShowRoom(lang: LANG): Promise<{ entities: Category[] }> {
    const result = await this.categoryRepo
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.images', 'images')
      .leftJoinAndSelect('category.translates', 'translates')
      .leftJoinAndSelect('category.products', 'products', 'products.show_on_main_page = :showOnMainPage', {
        showOnMainPage: true,
      })
      .leftJoinAndSelect('products.images', 'product_images')
      .leftJoinAndSelect('products.stock', 'product_stock')
      .leftJoinAndSelect('products.translates', 'product_translates')
      .where('category.show_on_main_page = :categoryShowOnMainPage', {
        categoryShowOnMainPage: true,
      })
      .orderBy('category.created_at', 'DESC')
      .addOrderBy('products.created_at', 'DESC')
      .getMany()

    const entities: Category[] = result.map((entity): Category => {
      if (entity.products?.length) {
        entity.products = entity.products.slice(0, 20)
      }
      return entity
    })

    const allProducts = entities.flatMap((category) => category.products || [])

    if (allProducts.length > 0) {
      const productIds = allProducts.map((p) => p.id)

      const ratings = await this.categoryRepo.manager
        .createQueryBuilder()
        .select('r.productIdId', 'productId')
        .addSelect('COALESCE(AVG(r.rating), 0)', 'averageRating')
        .from('rating', 'r')
        .where('r.productIdId IN (:...productIds)', { productIds })
        .groupBy('r.productIdId')
        .getRawMany()

      const ratingMap = new Map<number, number>()
      ratings.forEach((rating) => {
        ratingMap.set(Number(rating.productId), Math.round(parseFloat(String(rating.averageRating)) * 10) / 10 || 0)
      })

      entities.forEach((category) => {
        if (category.products?.length) {
          category.products.forEach((product) => {
            product.rating = ratingMap.get(product.id) || 0
          })
        }
      })
    }

    const mappedEntities = applyTranslations(entities, lang)

    for (const category of mappedEntities) {
      if (category.products?.length) {
        category.products = applyTranslations(category.products, lang)
      }
    }

    return { entities: mappedEntities }
  }

  async findAll(take: number, skip: number, lang: LANG): Promise<{ entities: Category[]; count: number }> {
    const rootCategories = await this.categoryRepo.find({
      where: { parent: IsNull() },
      take,
      skip,
      order: { created_at: 'DESC' },
      relations: ['translates', 'images'],
    })

    const entities: Category[] = []

    for (const rootCategory of rootCategories) {
      const tree = await this.categoryRepo.findDescendantsTree(rootCategory, {
        relations: [
          'parent',
          'parent.translates',
          'children',
          'children.images',
          'children.translates',
          'translates',
          'images',
        ],
      })
      entities.push(tree)
    }

    const applyTranslationsRecursively = (categories: Category[]): Category[] => {
      const translatedCategories = applyTranslations(categories, lang)

      for (const category of translatedCategories) {
        if (category.parent) {
          const [translatedParentCategory] = applyTranslations([category.parent], lang)
          category.parent = translatedParentCategory
        }

        if (category.seo_filters?.length) {
          category.seo_filters = applyTranslations(category.seo_filters, lang)
        }

        if (category?.children?.length) {
          category.children = applyTranslationsRecursively(category.children)
        }
      }

      return translatedCategories
    }

    const mappedEntities = applyTranslationsRecursively(entities)

    const count = await this.categoryRepo.count({ where: { parent: IsNull() } })

    return { entities: mappedEntities, count }
  }

  async findAllSubtree(depth: number, lang: LANG): Promise<{ entities: Category[] }> {
    const rootRelations = ['parent', 'parent.translates', 'translates', 'images', 'seo_filters']

    const relationsSet = new Set<string>(rootRelations)

    for (let level = 1; level <= Math.max(0, depth); level++) {
      const chain = Array(level).fill('children').join('.')
      relationsSet.add(chain)
      relationsSet.add(`${chain}.images`)
      relationsSet.add(`${chain}.translates`)
      relationsSet.add(`${chain}.seo_filters`)
    }

    const relations = Array.from(relationsSet)

    const roots = await this.categoryRepo.find({
      where: { parent: IsNull() },
      relations,
      order: { created_at: 'DESC' },
    })

    if (!roots?.length) return { entities: [] }

    const applyTranslationsRecursively = (category: Category): Category => {
      const [translated] = applyTranslations([category], lang)

      if (translated.parent) {
        const [translatedParentCategory] = applyTranslations([translated.parent], lang)
        translated.parent = translatedParentCategory
      }

      if (translated.seo_filters?.length) {
        translated.seo_filters = applyTranslations(translated.seo_filters, lang)
      }

      if (translated.children?.length) {
        translated.children = translated.children.map((c: Category) => applyTranslationsRecursively(c))
      }

      return translated
    }

    const mappedEntities = roots.map((r) => applyTranslationsRecursively(r))

    const fillProductsCount = async (node: Category) => {
      const count = await this.categoryRepo.manager
        .getRepository('Product')
        .count({ where: { category_id: { id: node.id } } })

      node.products_count = count

      this.logger.debug(
        'fillProductsCount: node.id=' + node.id + ' title=' + node.title + ' products_count=' + node.products_count
      )

      if (node.children?.length) {
        for (const child of node.children) {
          await fillProductsCount(child)
        }
      }
    }

    for (const root of mappedEntities) {
      await fillProductsCount(root)
    }

    return { entities: mappedEntities }
  }

  async update(id: number, lang: LANG, dto: CategoryUpdateDto): Promise<Category | null> {
    const categoryExist = await this.categoryRepo.findOne({ where: { id } })

    if (!categoryExist) throw new NotFoundException('category is NOT_FOUND')

    try {
      const newTitle = dto.title ? String(dto.title).trim() : undefined
      if (newTitle && newTitle.toLowerCase() !== String(categoryExist.title || '').toLowerCase()) {
        const exists = await this.categoryRepo
          .createQueryBuilder('category')
          .where('LOWER(category.title) = :title', {
            title: newTitle.toLowerCase(),
          })
          .andWhere('category.id != :id', { id })
          .getOne()

        if (exists) {
          throw new BadRequestException('NAME_ALREADY_RESERVED')
        }
      }

      const url = dto.url && String(dto.url).trim() !== '' ? dto.url : undefined

      const {
        title_ua,
        title_en,
        seo_text_ua,
        seo_text_en,
        structure,
        popular_tours_ids,
        recommended_post_ids,
        ...categoryData
      } = dto
      const translations: { lang: LANG; field: string; value: string }[] = []

      if (title_ua !== undefined) translations.push({ lang: LANG.UA, field: 'title', value: title_ua })
      if (title_en !== undefined) translations.push({ lang: LANG.EN, field: 'title', value: title_en })
      if (seo_text_ua !== undefined) translations.push({ lang: LANG.UA, field: 'seo_text', value: seo_text_ua })
      if (seo_text_en !== undefined) translations.push({ lang: LANG.EN, field: 'seo_text', value: seo_text_en })

      await this.categoryRepo.update(id, {
        ...categoryData,
        ...(url ? { url } : {}),
        ...(structure ? { structure } : {}),
      })

      if (popular_tours_ids !== undefined) {
        const categoryToUpdate = await this.categoryRepo.findOne({
          where: { id },
          relations: ['popular_tours', 'popular_tours.category_id'],
        })
        if (categoryToUpdate) {
          categoryToUpdate.popular_tours = popular_tours_ids.map((pid) => ({ id: pid }) as Product)
          await this.categoryRepo.save(categoryToUpdate)
        }
      }

      if (recommended_post_ids !== undefined) {
        const categoryToUpdate = await this.categoryRepo.findOne({
          where: { id },
          relations: ['recommended_posts'],
        })
        if (categoryToUpdate) {
          categoryToUpdate.recommended_posts = recommended_post_ids.map((pid) => ({ id: pid }) as unknown as Post)
          await this.categoryRepo.save(categoryToUpdate)
        }
      }

      // Update translations
      if (translations.length) {
        for (const t of translations) {
          // Try to find existing translation
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
              entity_id: { id } as Category,
              lang: t.lang,
              field: t.field,
              value: t.value,
            })
            await this.entityTranslateRepo.save(newTrans)
          }
        }
      }
    } catch (err) {
      this.logger.error(`Error while updating category \n ${err}`)
      if (err instanceof BadRequestException) {
        throw err
      }
      if (err?.code === '23505') {
        throw new BadRequestException('NAME_ALREADY_RESERVED')
      }
      throw new BadRequestException(`category is NOT_UPDATED`)
    }

    return await this.findOne(id, lang)
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      // Find children and set their parent to null (move to root) BEFORE deleting
      const children = await this.categoryRepo.find({
        where: { parent: { id } },
      })

      if (children.length > 0) {
        for (const child of children) {
          child.parent = null
          await this.categoryRepo.save(child)
        }
      }

      const hasProducts = await this.categoryRepo.manager.getRepository('Product').count({
        where: { category_id: { id: id } },
      })
      if (hasProducts > 0) throw new BadRequestException('HAS_CHILDS')

      const hasMenus = await this.categoryRepo.manager.getRepository('Menu').count({
        where: { category_id: { id: id } },
      })
      if (hasMenus > 0) throw new BadRequestException('HAS_CHILDS')

      const hasSeoFilters = await this.categoryRepo.manager.getRepository('SeoFilter').count({
        where: { category_id: { id: id } },
      })
      if (hasSeoFilters > 0) throw new BadRequestException('HAS_CHILDS')

      const result = await this.categoryRepo.delete(id)
      if (result.affected === 0) {
        throw new NotFoundException('category is NOT_FOUND')
      } else {
        await this.deleteImages(id)
      }
    } catch (err) {
      this.logger.error(`Error while deleting category \n ${err}`)
      // Removed the 23503 check because now we handle children and products are set to null
      throw err
    }

    return { message: 'SUCCESS' }
  }

  async createTranslates(dto: CategoryCreateTranslateDto[]): Promise<CategoryTranslate[] | null> {
    if (dto?.length) {
      const results: CategoryTranslate[] = []

      for (const translate of dto) {
        const data = this.entityTranslateRepo.create(translate)
        const result = await this.entityTranslateRepo.save(data)
        results.push(result)
      }

      return results
    }
    return null
  }

  async updateTranslates(dto: CategoryUpdateTranslateDto[]): Promise<CategoryTranslate[] | null> {
    const results: CategoryTranslate[] = []

    for (const translate of dto) {
      const result = await this.entityTranslateRepo.update(translate.id, {
        ...translate,
      })

      if (result.affected === 0) throw new NotFoundException('category translate is NOT_FOUND')

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
      throw new NotFoundException('category translate is NOT_FOUND')
    }

    return { message: 'OK' }
  }

  async createImage(dto: CategoryCreateImageDto): Promise<CategoryImage> {
    const entity_id = typeof dto.entity_id === 'number' ? { id: dto.entity_id } : dto.entity_id

    const newImage = this.entityImageRepo.create({
      ...dto,
      entity_id,
    })
    try {
      return await this.entityImageRepo.save(newImage)
    } catch (err) {
      this.logger.error(`Error while saving category image: ${err}`)
      throw new BadRequestException('category image is NOT_CREATED')
    }
  }

  async addImage(categoryId: number, dto: AddCategoryImageDto): Promise<CategoryImage> {
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    })

    if (!category) throw new NotFoundException('category is NOT_FOUND')

    const image = this.entityImageRepo.create({
      path: dto.path,
      path_md: dto.path_md,
      path_sm: dto.path_sm,
      entity_id: category,
      name: dto.path.split('/').pop() || 'image',
    })

    try {
      return await this.entityImageRepo.save(image)
    } catch (err) {
      this.logger.error(`Error while saving category image: ${err}`)
      throw new BadRequestException('category image is NOT_CREATED')
    }
  }

  async deleteImage(id: number): Promise<void> {
    const image = await this.entityImageRepo.findOne({ where: { id } })

    if (!image) throw new NotFoundException('category image is NOT_FOUND')

    await this.entityImageRepo.delete(id)
  }

  async deleteImages(entity_id: number): Promise<void> {
    const deleteCandidates = await this.entityImageRepo.find({
      where: { entity_id: { id: entity_id } },
    })

    if (deleteCandidates?.length) {
      await this.entityImageRepo.remove(deleteCandidates)
    }
  }

  async findSubtree(value: FineOneWhereType, depth: number): Promise<Category | null> {
    let where: FindOptionsWhere<Category>

    if (typeof value === 'number') {
      where = { id: value }
    } else {
      where = { url: value }
    }
    const rootRelations = ['parent', 'parent.translates', 'translates', 'images']

    const relationsSet = new Set<string>(rootRelations)

    for (let level = 1; level <= Math.max(0, depth); level++) {
      const chain = Array(level).fill('children').join('.')
      relationsSet.add(chain)
      relationsSet.add(`${chain}.images`)
      relationsSet.add(`${chain}.translates`)
    }

    const relations = Array.from(relationsSet)

    const tree = await this.categoryRepo.findOne({ where, relations })

    if (!tree) throw new NotFoundException('category is NOT_FOUND')

    const collectIds = (node: Category, out: number[] = []) => {
      if (node?.id) out.push(node.id)
      if (node.children?.length) {
        for (const c of node.children) {
          collectIds(c, out)
        }
      }
      return out
    }

    const ids = collectIds(tree)

    if (ids.length) {
      const rawCounts = await this.categoryRepo.manager
        .getRepository('Product')
        .createQueryBuilder('p')
        .select('p.category_id', 'categoryId')
        .addSelect('COUNT(p.id)', 'count')
        .where('p.category_id IN (:...ids)', { ids })
        .groupBy('p.category_id')
        .getRawMany()

      const countMap = new Map<number, number>()
      rawCounts.forEach((r) => {
        const cid = Number(r.categoryId)
        const cnt = Number(r.count)
        if (!Number.isNaN(cid)) countMap.set(cid, cnt)
      })

      const fillProductsCount = (node: Category) => {
        node.products_count = countMap.get(node.id) || 0
        if (node.children?.length) {
          for (const c of node.children) {
            fillProductsCount(c)
          }
        }
      }

      fillProductsCount(tree)
    }

    return tree as Category | null
  }

  async getAdditionalFilters(
    categoryId: number
  ): Promise<{ start_points: AdditionalFilterItem[]; end_points: AdditionalFilterItem[] }> {
    if (typeof categoryId !== 'number' || Number.isNaN(categoryId)) {
      throw new BadRequestException('category id is required and must be a number')
    }

    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    })
    if (!category) throw new NotFoundException('category is NOT_FOUND')

    const rawRows = await this.categoryRepo.manager
      .createQueryBuilder()
      .select('roadmap.id', 'roadmapId')
      .addSelect('roadmap.start_point', 'start_point')
      .addSelect('roadmap.end_point', 'end_point')
      .addSelect('roadmap.time', 'time')
      .addSelect('roadmap.description', 'description')
      .addSelect('roadmap.order', 'order')
      .addSelect('product.id', 'productId')
      .addSelect('product.title', 'productTitle')
      .addSelect('product.url', 'productUrl')
      .addSelect('city.id', 'cityId')
      .addSelect('city.title', 'cityTitle')
      .from('roadmap', 'roadmap')
      .innerJoin('product', 'product', 'product.id = roadmap.product_id')
      .leftJoin('city', 'city', 'city.id = roadmap.city_id')
      .where('product.category_id = :categoryId', { categoryId })
      .getRawMany()

    const start_points = rawRows
      .filter((row) => row.start_point === true || row.start_point === 'true' || row.start_point === 1)
      .map((row) => ({
        roadmap_id: Number(row.roadmapId),
        product_id: Number(row.productId),
        product_title: row.productTitle,
        product_url: row.productUrl,
        city_id: row.cityId ? Number(row.cityId) : null,
        city_title: row.cityTitle || null,
        time: row.time,
        description: row.description,
        order: row.order,
      }))

    const end_points = rawRows
      .filter((row) => row.end_point === true || row.end_point === 'true' || row.end_point === 1)
      .map((row) => ({
        roadmap_id: Number(row.roadmapId),
        product_id: Number(row.productId),
        product_title: row.productTitle,
        product_url: row.productUrl,
        city_id: row.cityId ? Number(row.cityId) : null,
        city_title: row.cityTitle || null,
        time: row.time,
        description: row.description,
        order: row.order,
      }))

    return { start_points, end_points }
  }
}
