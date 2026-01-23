import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Category } from 'src/modules/category/entities/category.entity'
import { PageConstructor } from 'src/modules/page-constructor/entities/page-constructor.entity'
import { PageConstructorCategory } from 'src/modules/page-constructor-category/entities/page-constructor-category.entity'
import { SeoFilter } from 'src/modules/seo-filter/entities/seo-filter.entity'
import { Repository, DeepPartial } from 'typeorm'

import { MenuCreateDto } from './dto/menu-create.dto'
import { MenuUpdateDto } from './dto/menu-update.dto'
import { Menu, MenuType } from './entities/menu.entity'

@Injectable()
export class MenuService {
  private readonly logger = new Logger(MenuService.name)

  constructor(
    @InjectRepository(Menu)
    private readonly repo: Repository<Menu>
  ) {}

  async find(take = 20, skip = 0, type: MenuType = MenuType.TOURS) {
    const [entities, count] = await this.repo.findAndCount({
      where: { type },
      take,
      skip,
      order: { order_in_list: 'ASC', created_at: 'DESC' },
      relations: [
        'category_id',
        'category_id.children',
        'category_id.translates',
        'category_id.children.translates',
        'seo_filters',
        'seo_filters.translates',
        'page_constructor_category_id',
        'page_constructor_category_id.pages',
        'page_constructors',
      ],
    })
    return { entities, count }
  }

  async findAllEntities(type: MenuType = MenuType.TOURS) {
    const entities = await this.repo.find({
      where: { type },
      order: { order_in_list: 'ASC' },
      relations: [
        'category_id',
        'category_id.children',
        'category_id.translates',
        'category_id.children.translates',
        'seo_filters',
        'seo_filters.translates',
        'page_constructor_category_id',
        'page_constructor_category_id.pages',
        'page_constructors',
      ],
    })
    return { entities }
  }

  async findOne(id: number): Promise<Menu | null> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['category_id', 'seo_filters', 'page_constructor_category_id', 'page_constructors'],
    })
    if (!entity) throw new NotFoundException('menu is NOT_FOUND')
    return entity
  }

  async create(dto: MenuCreateDto): Promise<Menu> {
    const data: DeepPartial<Menu> = {
      order_in_list: dto.order_in_list || 0,
      type: dto.type || MenuType.TOURS,
    }

    if (dto.category_id) data.category_id = { id: dto.category_id }
    if (dto.seo_filter_ids && Array.isArray(dto.seo_filter_ids))
      data.seo_filters = dto.seo_filter_ids.map((id) => ({ id }))

    if (dto.page_constructor_category_id) data.page_constructor_category_id = { id: dto.page_constructor_category_id }

    if (dto.page_constructor_ids && Array.isArray(dto.page_constructor_ids))
      data.page_constructors = dto.page_constructor_ids.map((id) => ({ id }))

    const entity = this.repo.create(data)
    try {
      return await this.repo.save(entity)
    } catch (err) {
      this.logger.error(`Error while creating menu: ${err}`)
      throw new BadRequestException('menu is NOT_CREATED')
    }
  }

  async update(id: number, dto: MenuUpdateDto): Promise<Menu> {
    const exists = await this.repo.findOne({ where: { id } })
    if (!exists) throw new NotFoundException('menu is NOT_FOUND')

    const entity = await this.repo.findOne({
      where: { id },
      relations: ['category_id', 'seo_filters', 'page_constructor_category_id', 'page_constructors'],
    })
    if (!entity) throw new NotFoundException('menu is NOT_FOUND')

    if (dto.type) entity.type = dto.type

    if (dto.category_id !== undefined) {
      entity.category_id = dto.category_id ? ({ id: dto.category_id } as Category) : null
    }

    if (dto.seo_filter_ids !== undefined) {
      entity.seo_filters = Array.isArray(dto.seo_filter_ids)
        ? dto.seo_filter_ids.map((i) => ({ id: i }) as SeoFilter)
        : []
    }

    if (dto.page_constructor_category_id !== undefined) {
      entity.page_constructor_category_id = dto.page_constructor_category_id
        ? ({ id: dto.page_constructor_category_id } as PageConstructorCategory)
        : null
    }

    if (dto.page_constructor_ids !== undefined) {
      entity.page_constructors = Array.isArray(dto.page_constructor_ids)
        ? dto.page_constructor_ids.map((i) => ({ id: i }) as PageConstructor)
        : []
    }

    if (dto.order_in_list !== undefined) {
      entity.order_in_list = dto.order_in_list
    }

    try {
      await this.repo.save(entity)
    } catch (err) {
      this.logger.error(`Error while updating menu: ${err?.message ?? err}`)
      throw new BadRequestException('menu is NOT_UPDATED')
    }

    return (await this.repo.findOne({
      where: { id },
      relations: ['category_id', 'seo_filters', 'page_constructor_category_id', 'page_constructors'],
    })) as Menu
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.repo.delete(id)
      if (result.affected === 0) throw new NotFoundException('menu is NOT_FOUND')
    } catch (err) {
      this.logger.error(`Error while deleting menu: ${err}`)
      throw err
    }

    return { message: 'SUCCESS' }
  }

  async reorder(orders: { id: number; order_in_list: number }[]): Promise<{ message: string }> {
    if (!Array.isArray(orders)) throw new BadRequestException('orders is required')

    const ids = orders.map((o) => o.id)
    const exists = await this.repo.findByIds(ids)
    if (exists.length !== ids.length) throw new BadRequestException('some ids are invalid')

    for (const o of orders) {
      await this.repo.update(o.id, { order_in_list: o.order_in_list })
    }

    return { message: 'Order updated' }
  }
}
