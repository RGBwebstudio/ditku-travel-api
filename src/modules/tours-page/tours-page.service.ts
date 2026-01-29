import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { Post } from 'src/modules/posts/entities/post.entity'
import { Product } from 'src/modules/product/entities/product.entity'
import { SeoFilter } from 'src/modules/seo-filter/entities/seo-filter.entity'
import { Repository } from 'typeorm'

import { UpdateToursPageDto } from './dto/update-tours-page.dto'
import { ToursPageCategoryItem } from './entities/tours-page-category-item.entity'
import { ToursPage } from './entities/tours-page.entity'

@Injectable()
export class ToursPageService {
  private readonly logger = new Logger(ToursPageService.name)

  constructor(
    @InjectRepository(ToursPage)
    private readonly repo: Repository<ToursPage>
  ) {}

  async get(lang: LANG): Promise<ToursPage> {
    let entity = await this.repo.findOne({
      where: { lang },
      relations: [
        'popular_tours',
        'popular_tours.category_id',
        'popular_tours.images',
        'popular_tours.translates',
        'navigator_subcategories',
        'navigator_subcategories.category_id',
        'navigator_subcategories.translates',
        'recommended_posts',
        'recommended_posts.category_id',
        'recommended_posts.images',
        'recommended_posts.translates',
      ],
    })

    if (!entity && lang !== LANG.UA) {
      entity = await this.repo.findOne({
        where: { lang: LANG.UA },
        relations: [
          'popular_tours',
          'popular_tours.category_id',
          'popular_tours.images',
          'popular_tours.translates',
          'navigator_subcategories',
          'navigator_subcategories.translates',
          'recommended_posts',
          'recommended_posts.translates',
          'recommended_posts.images',
        ],
      })
    }

    if (!entity) throw new NotFoundException('tours-page not found')

    return entity
  }

  async update(dto: UpdateToursPageDto): Promise<ToursPage> {
    const { lang } = dto

    if (dto.structure && 'cta_section' in dto.structure) {
      delete (dto.structure as Record<string, unknown>).cta_section
    }

    const exist = await this.repo.findOne({ where: { lang } })

    if (exist) {
      await this.repo.update({ id: exist.id }, { structure: dto.structure })

      if (dto.popular_tours_ids !== undefined) {
        const entity = await this.repo.findOne({ where: { id: exist.id }, relations: ['popular_tours'] })
        if (entity) {
          entity.popular_tours = dto.popular_tours_ids.map((id) => {
            const product = new Product()
            product.id = id
            return product
          })
          await this.repo.save(entity)
        }
      }

      if (dto.recommended_post_ids !== undefined) {
        const entity = await this.repo.findOne({ where: { id: exist.id }, relations: ['recommended_posts'] })
        if (entity) {
          entity.recommended_posts = dto.recommended_post_ids.map((id) => {
            const post = new Post()
            post.id = id
            return post
          })
          await this.repo.save(entity)
        }
      }

      if (dto.navigator_subcategory_ids !== undefined) {
        const entity = await this.repo.findOne({ where: { id: exist.id }, relations: ['navigator_subcategories'] })
        if (entity) {
          entity.navigator_subcategories = dto.navigator_subcategory_ids.map((id) => {
            const filter = new SeoFilter()
            filter.id = id
            return filter
          })
          await this.repo.save(entity)
        }
      }

      if (dto.category_items !== undefined) {
        const entity = await this.repo.findOne({
          where: { id: exist.id },
          relations: ['category_items'],
        })
        if (entity) {
          entity.category_items = dto.category_items.map((item) => {
            const newItem = new ToursPageCategoryItem()
            newItem.order = item.order

            if (item.type) {
              newItem.type = item.type
            }

            if (item.category_id) {
              newItem.category = { id: item.category_id } as any
            } else if (item.seo_filter_id) {
              newItem.seo_filter = { id: item.seo_filter_id } as any
            }

            return newItem
          })
          await this.repo.save(entity)
        }
      }

      return this.repo.findOne({
        where: { id: exist.id },
        relations: [
          'popular_tours',
          'popular_tours.category_id',
          'popular_tours.images',
          'popular_tours.translates',
          'navigator_subcategories',
          'navigator_subcategories.category_id',
          'navigator_subcategories.translates',
          'recommended_posts',
          'recommended_posts.category_id',
          'recommended_posts.images',
          'recommended_posts.translates',
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
      }) as Promise<ToursPage>
    }

    const created = this.repo.create({
      ...dto,
      popular_tours: dto.popular_tours_ids
        ? dto.popular_tours_ids.map((id) => {
            const product = new Product()
            product.id = id
            return product
          })
        : [],
      navigator_subcategories: dto.navigator_subcategory_ids
        ? dto.navigator_subcategory_ids.map((id) => {
            const filter = new SeoFilter()
            filter.id = id
            return filter
          })
        : [],
      recommended_posts: dto.recommended_post_ids
        ? dto.recommended_post_ids.map((id) => {
            const post = new Post()
            post.id = id
            return post
          })
        : [],
      category_items: dto.category_items
        ? dto.category_items.map((item) => {
            const newItem = new ToursPageCategoryItem()
            newItem.order = item.order

            if (item.type) {
              newItem.type = item.type
            }

            if (item.category_id) {
              newItem.category = { id: item.category_id } as any
            } else if (item.seo_filter_id) {
              newItem.seo_filter = { id: item.seo_filter_id } as any
            }

            return newItem
          })
        : [],
    })
    return this.repo.save(created)
  }

  async getCategoryItems(lang: LANG): Promise<ToursPageCategoryItem[]> {
    let entity = await this.repo.findOne({
      where: { lang },
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

    if (entity && lang !== LANG.UA && (!entity.category_items || entity.category_items.length === 0)) {
      const uaPage = await this.repo.findOne({
        where: { lang: LANG.UA },
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

      if (uaPage && uaPage.category_items?.length > 0) {
        entity.category_items = uaPage.category_items
      }
    }

    if (!entity && lang !== LANG.UA) {
      entity = await this.repo.findOne({
        where: { lang: LANG.UA },
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
    }

    if (!entity || !entity.category_items) return []

    // Populate counts
    if (entity.category_items.length) {
      const categoryIds = entity.category_items.map((i) => i.category?.id).filter((id): id is number => !!id)
      const seoFilterIds = entity.category_items.map((i) => i.seo_filter?.id).filter((id): id is number => !!id)

      if (categoryIds.length > 0) {
        const counts = await this.repo.manager
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
        const counts = await this.repo.manager
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
}
