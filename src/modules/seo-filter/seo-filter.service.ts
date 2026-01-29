import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { Category } from 'src/modules/category/entities/category.entity'
import { City } from 'src/modules/city/entities/city.entity'
import { Country } from 'src/modules/country/entities/country.entity'
import { Post } from 'src/modules/posts/entities/post.entity'
import { Product } from 'src/modules/product/entities/product.entity'
import { Repository, In } from 'typeorm'

import { SeoFilterCreateTranslateDto } from './dto/seo-filter-create-translate.dto'
import { SeoFilterCreateDto } from './dto/seo-filter-create.dto'
import { SeoFilterUpdateTranslateDto } from './dto/seo-filter-update-translate.dto'
import { SeoFilterUpdateDto } from './dto/seo-filter-update.dto'
import { SeoFilterCategoryItem } from './entities/seo-filter-category-item.entity'
import { SeoFilterTranslate } from './entities/seo-filter-translate.entity'
import { SeoFilter } from './entities/seo-filter.entity'

type SeoFilterRel = Omit<SeoFilter, 'category_id' | 'city_id' | 'country_id' | 'parent'> & {
  category_id?: Category | null
  city_id?: City | null
  country_id?: Country | null
  parent?: SeoFilter | null
  popular_tours?: Product[]
  recommended_posts?: Post[]
  category_items?: SeoFilterCategoryItem[]
}

@Injectable()
export class SeoFilterService {
  private readonly logger = new Logger(SeoFilterService.name)

  constructor(
    @InjectRepository(SeoFilter)
    private readonly seoFilterRepository: Repository<SeoFilter>,

    @InjectRepository(SeoFilterTranslate)
    private readonly entityTranslateRepo: Repository<SeoFilterTranslate>
  ) {}

  async find(lang: LANG = LANG.UA): Promise<{ entities: SeoFilter[]; count: number }> {
    const treeRepository = this.seoFilterRepository.manager.getTreeRepository(SeoFilter)
    const treeRoots = await treeRepository.findTrees({ relations: ['translates'] })
    const totalCount = await this.seoFilterRepository.count()

    // Helper to apply translations recursively
    const applyToTree = (nodes: SeoFilter[]) => {
      const translated = applyTranslations(nodes, lang)
      for (const node of translated) {
        if (node.children && node.children.length > 0) {
          node.children = applyToTree(node.children)
        }
      }
      return translated
    }

    const translatedRoots = applyToTree(treeRoots)

    return { entities: translatedRoots, count: totalCount }
  }

  async findOne(id: number, lang: LANG = LANG.UA): Promise<SeoFilter | null> {
    const treeRepository = this.seoFilterRepository.manager.getTreeRepository(SeoFilter)
    const seoFilterEntity = await this.seoFilterRepository.findOne({
      where: { id },
    })
    if (!seoFilterEntity) throw new NotFoundException('seo_filter is NOT_FOUND')

    const descendantTree = await treeRepository.findDescendantsTree(seoFilterEntity)

    const collectedIds: number[] = []
    const collectNodes = (nodeList: SeoFilter[]) => {
      for (const node of nodeList) {
        collectedIds.push(node.id)
        if (node.children && node.children.length) collectNodes(node.children)
      }
    }
    collectNodes(Array.isArray(descendantTree) ? descendantTree : [descendantTree])

    const enrichedEntities = collectedIds.length
      ? await this.seoFilterRepository.find({
          where: { id: In(collectedIds) },
          relations: [
            'category_id',
            'city_id',
            'country_id',
            'translates',
            'popular_tours',
            'popular_tours.category_id',
            'popular_tours.images',
            'popular_tours.translates',
            'recommended_posts',
            'recommended_posts.category_id',
          ],
        })
      : []

    const enrichedMap = new Map<number, SeoFilter>(enrichedEntities.map((entity) => [entity.id, entity]))

    const enrichNode = (node: SeoFilter): SeoFilter => {
      const enrichedNode = enrichedMap.get(node.id) as SeoFilter
      if (!enrichedNode) return node
      if (node.children && node.children.length) {
        enrichedNode.children = node.children.map(enrichNode)
      } else {
        enrichedNode.children = []
      }
      return enrichedNode
    }

    const rootNode = Array.isArray(descendantTree) ? descendantTree[0] : descendantTree
    const enrichedRoot = enrichNode(rootNode as SeoFilter)

    // Apply translations recursively
    const applyToTree = (nodes: SeoFilter[]) => {
      const translated = applyTranslations(nodes, lang)
      for (const node of translated) {
        if (node.children && node.children.length > 0) {
          node.children = applyToTree(node.children)
        }
      }
      return translated
    }

    return applyToTree([enrichedRoot])[0]
  }

  async findOneByUrl(url: string, lang: LANG = LANG.UA): Promise<SeoFilter | null> {
    const treeRepository = this.seoFilterRepository.manager.getTreeRepository(SeoFilter)
    const seoFilterEntity = await this.seoFilterRepository.findOne({
      where: { url },
    })
    if (!seoFilterEntity) throw new NotFoundException('seo_filter is NOT_FOUND')

    const descendantTree = await treeRepository.findDescendantsTree(seoFilterEntity)

    const collectedIds: number[] = []
    const collectNodes = (nodeList: SeoFilter[]) => {
      for (const node of nodeList) {
        collectedIds.push(node.id)
        if (node.children && node.children.length) collectNodes(node.children)
      }
    }
    collectNodes(Array.isArray(descendantTree) ? descendantTree : [descendantTree])

    const enrichedEntities = collectedIds.length
      ? await this.seoFilterRepository.find({
          where: { id: In(collectedIds) },
          relations: [
            'category_id',
            'city_id',
            'country_id',
            'translates',
            'popular_tours',
            'popular_tours.category_id',
            'popular_tours.images',
            'popular_tours.translates',
            'recommended_posts',
            'recommended_posts.category_id',
          ],
        })
      : []

    const enrichedMap = new Map<number, SeoFilter>(enrichedEntities.map((entity) => [entity.id, entity]))

    const enrichNode = (node: SeoFilter): SeoFilter => {
      const enrichedNode = enrichedMap.get(node.id) as SeoFilter
      if (!enrichedNode) return node
      if (node.children && node.children.length) {
        enrichedNode.children = node.children.map(enrichNode)
      } else {
        enrichedNode.children = []
      }
      return enrichedNode
    }

    const rootNode = Array.isArray(descendantTree) ? descendantTree[0] : descendantTree
    const enrichedRoot = enrichNode(rootNode as SeoFilter)

    // Apply translations recursively
    const applyToTree = (nodes: SeoFilter[]) => {
      const translated = applyTranslations(nodes, lang)
      for (const node of translated) {
        if (node.children && node.children.length > 0) {
          node.children = applyToTree(node.children)
        }
      }
      return translated
    }

    return applyToTree([enrichedRoot])[0]
  }

  async getCategoryItems(id: number, lang: LANG): Promise<SeoFilterCategoryItem[]> {
    const entity = await this.seoFilterRepository.findOne({
      where: { id },
      relations: [
        'category_items',
        'category_items.category',
        'category_items.category.translates',
        'category_items.seo_filter',
        'category_items.seo_filter.translates',
        'category_items.seo_filter.category_id',
      ],
      order: {
        category_items: {
          order: 'ASC',
        },
      },
    })

    if (!entity || !entity.category_items) return []

    // Apply translations
    entity.category_items.forEach((item) => {
      if (item.category) applyTranslations([item.category], lang)
      if (item.seo_filter) applyTranslations([item.seo_filter], lang)
    })

    if (entity.category_items.length) {
      const categoryIds = entity.category_items.map((i) => i.category?.id).filter((id): id is number => !!id)
      const seoFilterIds = entity.category_items.map((i) => i.seo_filter?.id).filter((id): id is number => !!id)

      if (categoryIds.length > 0) {
        const counts = await this.seoFilterRepository.manager
          .getRepository('Product')
          .createQueryBuilder('product')
          .select('product.category_id', 'categoryId')
          .addSelect('COUNT(product.id)', 'count')
          .where('product.category_id IN (:...ids)', { ids: categoryIds })
          .groupBy('product.category_id')
          .getRawMany()

        const countMap = new Map<number, number>()
        counts.forEach((item) => {
          countMap.set(Number(item.categoryId), Number(item.count))
        })

        entity.category_items.forEach((item) => {
          if (item.category) {
            item.category.products_count = countMap.get(item.category.id) || 0
          }
        })
      }

      if (seoFilterIds.length > 0) {
        const counts = await this.seoFilterRepository.manager
          .getRepository('Product')
          .createQueryBuilder('product')
          .innerJoin('product.seo_filters', 'sf')
          .select('sf.id', 'filterId')
          .addSelect('COUNT(product.id)', 'count')
          .where('sf.id IN (:...ids)', { ids: seoFilterIds })
          .groupBy('sf.id')
          .getRawMany()

        const countMap = new Map<number, number>()
        counts.forEach((item) => {
          countMap.set(Number(item.filterId), Number(item.count))
        })

        entity.category_items.forEach((item) => {
          if (item.seo_filter) {
            item.seo_filter.products_count = countMap.get(item.seo_filter.id) || 0
          }
        })
      }
    }

    return entity.category_items
  }

  async create(createDto: SeoFilterCreateDto): Promise<SeoFilter> {
    const seoFilterData = this.seoFilterRepository.create()
    if (createDto.title !== undefined) {
      seoFilterData.title = createDto.title
    }
    if (createDto.url !== undefined) {
      seoFilterData.url = createDto.url
    }
    if (createDto.seo_title !== undefined) {
      seoFilterData.seo_title = createDto.seo_title
    }
    if (createDto.seo_description !== undefined) {
      seoFilterData.seo_description = createDto.seo_description
    }
    if (createDto.seo_text !== undefined) {
      seoFilterData.seo_text = createDto.seo_text
    }
    if (createDto.structure !== undefined) {
      seoFilterData.structure = createDto.structure
    }
    if (createDto.navigator_title !== undefined) {
      seoFilterData.navigator_title = createDto.navigator_title
    }

    if (createDto.category_id) {
      seoFilterData.category_id = {
        id: createDto.category_id,
      } as Category
    }
    if (createDto.city_id) {
      seoFilterData.city_id = {
        id: createDto.city_id,
      } as City
    }
    if (createDto.country_id) {
      seoFilterData.country_id = {
        id: createDto.country_id,
      } as Country
    }

    if (createDto.parent_id) {
      seoFilterData.parent = {
        id: createDto.parent_id,
      } as SeoFilter
    }

    if (createDto.popular_tours_ids) {
      seoFilterData.popular_tours = createDto.popular_tours_ids.map((id) => ({ id }) as Product)
    }

    if (createDto.recommended_post_ids) {
      seoFilterData.recommended_posts = createDto.recommended_post_ids.map((id) => ({ id }) as unknown as Post)
    }

    if (createDto.category_items) {
      seoFilterData.category_items = createDto.category_items.map((item) => {
        const newItem = new SeoFilterCategoryItem()
        newItem.order = item.order
        if (item.type) newItem.type = item.type
        if (item.category_id) newItem.category = { id: item.category_id } as Category
        else if (item.seo_filter_id) newItem.seo_filter = { id: item.seo_filter_id } as SeoFilter
        return newItem
      })
    }

    try {
      const savedEntity = await this.seoFilterRepository.save(seoFilterData)

      // Handle flattened translations
      const translations: SeoFilterCreateTranslateDto[] = []
      const langFields = ['title', 'navigator_title', 'seo_title', 'seo_description', 'seo_text']

      const payload = createDto as unknown as Record<string, unknown>

      for (const field of langFields) {
        if (payload[`${field}_ua`]) {
          translations.push({
            entity_id: savedEntity,
            lang: LANG.UA,
            field: field,
            value: payload[`${field}_ua`] as string,
          })
        }
        if (payload[`${field}_en`]) {
          translations.push({
            entity_id: savedEntity,
            lang: LANG.EN,
            field: field,
            value: payload[`${field}_en`] as string,
          })
        }
      }

      if (translations.length > 0) {
        await this.createTranslates(translations)
      }

      return (await this.findOne(savedEntity.id)) as SeoFilter
    } catch (err) {
      this.logger.error(`Error while creating seo_filter: ${err}`)
      throw new BadRequestException('seo_filter is NOT_CREATED')
    }
  }

  async update(id: number, updateDto: SeoFilterUpdateDto): Promise<SeoFilter> {
    const existingEntity = await this.seoFilterRepository.findOne({
      where: {
        id,
      },
      relations: ['popular_tours', 'popular_tours.category_id', 'recommended_posts', 'recommended_posts.category_id'],
    })
    if (!existingEntity) throw new NotFoundException('seo_filter is NOT_FOUND')

    if (updateDto.title !== undefined) {
      existingEntity.title = updateDto.title
    }
    if (updateDto.url !== undefined) {
      existingEntity.url = updateDto.url
    }
    if (updateDto.seo_title !== undefined) {
      existingEntity.seo_title = updateDto.seo_title
    }
    if (updateDto.seo_description !== undefined) {
      existingEntity.seo_description = updateDto.seo_description
    }
    if (updateDto.seo_text !== undefined) {
      existingEntity.seo_text = updateDto.seo_text
    }
    if (updateDto.structure !== undefined) {
      existingEntity.structure = updateDto.structure
    }
    if (updateDto.navigator_title !== undefined) {
      existingEntity.navigator_title = updateDto.navigator_title
    }

    const relEntity = existingEntity as SeoFilterRel
    if (updateDto.category_id !== undefined) {
      if (updateDto.category_id === null) {
        relEntity.category_id = null
      } else {
        relEntity.category_id = {
          id: updateDto.category_id,
        } as Category
      }
    }
    if (updateDto.city_id !== undefined) {
      if (updateDto.city_id === null) {
        relEntity.city_id = null
      } else {
        relEntity.city_id = {
          id: updateDto.city_id,
        } as City
      }
    }
    if (updateDto.country_id !== undefined) {
      if (updateDto.country_id === null) {
        relEntity.country_id = null
      } else {
        relEntity.country_id = {
          id: updateDto.country_id,
        } as Country
      }
    }

    if (updateDto.parent_id !== undefined) {
      if (updateDto.parent_id === null) {
        relEntity.parent = null
      } else {
        relEntity.parent = {
          id: updateDto.parent_id,
        } as SeoFilter
      }
    }

    if (updateDto.popular_tours_ids !== undefined) {
      relEntity.popular_tours = updateDto.popular_tours_ids.map((id) => ({ id }) as Product)
    }

    if (updateDto.recommended_post_ids !== undefined) {
      relEntity.recommended_posts = updateDto.recommended_post_ids.map((id) => ({ id }) as unknown as Post)
    }

    if (updateDto.category_items !== undefined) {
      relEntity.category_items = updateDto.category_items.map((item) => {
        const newItem = new SeoFilterCategoryItem()
        newItem.order = item.order
        if (item.type) newItem.type = item.type
        if (item.category_id) newItem.category = { id: item.category_id } as Category
        else if (item.seo_filter_id) newItem.seo_filter = { id: item.seo_filter_id } as SeoFilter
        return newItem
      })
    }

    try {
      await this.seoFilterRepository.save(relEntity as SeoFilter)

      // Handle flattened translations
      const translations: SeoFilterCreateTranslateDto[] = []
      const langFields = ['title', 'navigator_title', 'seo_title', 'seo_description', 'seo_text']

      const payload = updateDto as unknown as Record<string, unknown>

      for (const field of langFields) {
        if (payload[`${field}_ua`]) {
          translations.push({
            entity_id: existingEntity,
            lang: LANG.UA,
            field: field,
            value: payload[`${field}_ua`] as string,
          })
        }
        if (payload[`${field}_en`]) {
          translations.push({
            entity_id: existingEntity,
            lang: LANG.EN,
            field: field,
            value: payload[`${field}_en`] as string,
          })
        }
      }

      if (translations.length > 0) {
        await this.createTranslates(translations)
      }
    } catch (err) {
      this.logger.error(`Error while updating seo_filter: ${err}`)
      throw new BadRequestException('seo_filter is NOT_UPDATED')
    }

    return (await this.findOne(id)) as SeoFilter
  }

  async createTranslates(dto: SeoFilterCreateTranslateDto[]): Promise<SeoFilterTranslate[] | null> {
    if (dto?.length) {
      const results: SeoFilterTranslate[] = []

      for (const translate of dto) {
        const data = this.entityTranslateRepo.create(translate)
        const result = await this.entityTranslateRepo.save(data)
        results.push(result)
      }

      return results
    }
    return null
  }

  async updateTranslates(dto: SeoFilterUpdateTranslateDto[]): Promise<SeoFilterTranslate[] | null> {
    const results: SeoFilterTranslate[] = []

    for (const translate of dto) {
      const result = await this.entityTranslateRepo.update(translate.id, {
        ...translate,
      })

      if (result.affected === 0) throw new NotFoundException('seo_filter translate is NOT_FOUND')

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
      throw new NotFoundException('seo_filter translate is NOT_FOUND')
    }

    return { message: 'OK' }
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const deleteResult = await this.seoFilterRepository.delete(id)
      if (deleteResult.affected === 0) {
        throw new NotFoundException('seo_filter is NOT_FOUND')
      }
    } catch (err) {
      this.logger.error(`Error while deleting seo_filter: ${err}`)
      if (err?.code === '23503') {
        throw new BadRequestException('DEPENDENCY_EXISTS')
      }
      throw err
    }

    return { message: 'SUCCESS' }
  }

  async findByCategory(id: number, lang: LANG = LANG.UA): Promise<SeoFilter[]> {
    const treeRepository = this.seoFilterRepository.manager.getTreeRepository(SeoFilter)

    const roots = await this.seoFilterRepository.find({
      where: { category_id: { id } },
      relations: ['translates'],
    })

    if (!roots || roots.length === 0) return []

    const resultTrees: SeoFilter[] = []
    for (const root of roots) {
      const tree = await treeRepository.findDescendantsTree(root)
      resultTrees.push(tree)
    }

    return applyTranslations(resultTrees, lang)
  }
}
