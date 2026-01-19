import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { CreatePageConstructorCategoryDto } from './dto/create-page-constructor-category.dto'
import { UpdatePageConstructorCategoryDto } from './dto/update-page-constructor-category.dto'
import { PageConstructorCategory } from './entities/page-constructor-category.entity'
import { PageType } from '../page-constructor/entities/page-constructor.entity'

@Injectable()
export class PageConstructorCategoryService {
  constructor(
    @InjectRepository(PageConstructorCategory)
    private readonly categoryRepository: Repository<PageConstructorCategory>
  ) {}

  async create(createDto: CreatePageConstructorCategoryDto) {
    const category = this.categoryRepository.create(createDto)
    return await this.categoryRepository.save(category)
  }

  async findAll(type?: PageType) {
    const query = this.categoryRepository.createQueryBuilder('category')
    if (type) {
      query.where('category.type = :type', { type })
    }
    query.orderBy('category.id', 'ASC')
    return await query.getMany()
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } })
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} NOT_FOUND`)
    }
    return category
  }

  async update(id: number, updateDto: UpdatePageConstructorCategoryDto) {
    const category = await this.findOne(id)
    Object.assign(category, updateDto)
    return await this.categoryRepository.save(category)
  }

  async remove(id: number) {
    const category = await this.findOne(id)
    return await this.categoryRepository.remove(category)
  }
}
