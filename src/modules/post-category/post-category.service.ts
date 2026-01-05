import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { Repository } from 'typeorm'

import { PostCategoryCreateTranslateDto } from './dto/post-category-create-translate.dto'
import { PostCategoryCreateDto } from './dto/post-category-create.dto'
import { PostCategoryUpdateTranslateDto } from './dto/post-category-update-translate.dto'
import { PostCategoryUpdateDto } from './dto/post-category-update.dto'
import { PostCategoryTranslate } from './entities/post-category-translate.entity'
import { PostCategory } from './entities/post-category.entity'

@Injectable()
export class PostCategoryService {
  private readonly logger = new Logger(PostCategoryService.name)

  constructor(
    @InjectRepository(PostCategory)
    private readonly postCategoryRepository: Repository<PostCategory>,
    @InjectRepository(PostCategoryTranslate)
    private readonly postCategoryTranslateRepository: Repository<PostCategoryTranslate>
  ) {}

  async findAll(take?: number, skip?: number, lang?: LANG) {
    const [postCategories, count] = await this.postCategoryRepository.findAndCount({
      relations: ['translates'],
      take,
      skip,
      order: { created_at: 'DESC' },
    })

    const translatedPostCategories = lang ? applyTranslations(postCategories, lang) : postCategories

    return { entities: translatedPostCategories, count }
  }

  async findAllList(lang?: LANG) {
    const postCategories = await this.postCategoryRepository.find({
      relations: ['translates'],
      order: { created_at: 'DESC' },
    })

    const translated = lang ? applyTranslations(postCategories, lang) : postCategories

    return { entities: translated }
  }

  async findAllWithPosts(queryDto: { limit?: number; sort?: string; includeEmpty?: boolean }, lang?: LANG) {
    const { limit, sort = 'created_at:desc', includeEmpty = true } = queryDto

    // Parse sort parameter
    const [sortField, sortOrder] = sort.split(':')
    const orderDirection = sortOrder?.toLowerCase() === 'asc' ? 'ASC' : 'DESC'

    // Build query to fetch categories with posts
    const queryBuilder = this.postCategoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.posts', 'post')
      .leftJoinAndSelect('post.images', 'image')
      .leftJoinAndSelect('post.translates', 'postTranslate')
      .leftJoinAndSelect('category.translates', 'translate')
      .orderBy('category.created_at', 'DESC')

    // Add post sorting
    if (sortField === 'created_at' || sortField === 'createdAt') {
      queryBuilder.addOrderBy('post.created_at', orderDirection)
    } else if (sortField === 'title') {
      queryBuilder.addOrderBy('post.title', orderDirection)
    } else {
      queryBuilder.addOrderBy('post.created_at', 'DESC')
    }

    const categories = await queryBuilder.getMany()

    // Apply limit per category if specified
    let processedCategories = categories
    if (limit && limit > 0) {
      processedCategories = categories.map((category) => ({
        ...category,
        posts: category.posts?.slice(0, limit) || [],
      }))
    }

    // Filter out empty categories if requested
    if (!includeEmpty) {
      processedCategories = processedCategories.filter((category) => category.posts && category.posts.length > 0)
    }

    // Apply translations to categories
    const translatedCategories = lang ? applyTranslations(processedCategories, lang) : processedCategories

    // Apply translations to nested posts
    if (lang) {
      for (const category of translatedCategories) {
        if (category.posts && Array.isArray(category.posts)) {
          category.posts = applyTranslations(category.posts, lang)
        }
      }
    }

    return { entities: translatedCategories }
  }

  async findOne(id: number, lang?: LANG): Promise<PostCategory> {
    const postCategory = await this.postCategoryRepository.findOne({
      where: { id },
      relations: ['translates'],
    })
    if (!postCategory) throw new NotFoundException('post category is NOT_FOUND')
    if (lang) {
      const [translated] = applyTranslations([postCategory], lang)
      return translated
    }
    return postCategory
  }

  async create(createDto: PostCategoryCreateDto): Promise<PostCategory> {
    const { title_ua, title_en, ...rest } = createDto
    const title = rest.title ? String(rest.title).trim() : undefined

    if (title) {
      const existingWithSameTitle = await this.postCategoryRepository
        .createQueryBuilder('c')
        .where('LOWER(c.title) = :title', { title: title.toLowerCase() })
        .getOne()
      if (existingWithSameTitle) throw new BadRequestException('NAME_ALREADY_RESERVED')
    }

    const postCategoryData = this.postCategoryRepository.create(rest)
    try {
      const saved = await this.postCategoryRepository.save(postCategoryData)

      if (title_ua) await this.saveTranslate(saved, 'title', title_ua, LANG.UA)
      if (title_en) await this.saveTranslate(saved, 'title', title_en, LANG.EN)

      return await this.findOne(saved.id)
    } catch (err) {
      this.logger.error(`Error while creating post category ${err}`)
      throw new BadRequestException('post category is NOT_CREATED')
    }
  }

  async update(id: number, updateDto: PostCategoryUpdateDto): Promise<PostCategory> {
    const { title_ua, title_en, ...rest } = updateDto
    const existingPostCategory = await this.postCategoryRepository.findOne({
      where: { id },
    })
    if (!existingPostCategory) throw new NotFoundException('post category is NOT_FOUND')

    const newTitle = rest.title ? String(rest.title).trim() : undefined
    if (newTitle && newTitle.toLowerCase() !== String(existingPostCategory.title || '').toLowerCase()) {
      const duplicateTitleEntity = await this.postCategoryRepository
        .createQueryBuilder('c')
        .where('LOWER(c.title) = :title', { title: newTitle.toLowerCase() })
        .andWhere('c.id != :id', { id })
        .getOne()
      if (duplicateTitleEntity) throw new BadRequestException('NAME_ALREADY_RESERVED')
    }

    try {
      if (Object.keys(rest).length > 0) {
        await this.postCategoryRepository.update(id, { ...rest })
      }

      const entity = await this.postCategoryRepository.findOne({ where: { id } })
      if (!entity) throw new NotFoundException('post category is NOT_FOUND')

      if (title_ua !== undefined) await this.saveTranslate(entity, 'title', title_ua, LANG.UA)
      if (title_en !== undefined) await this.saveTranslate(entity, 'title', title_en, LANG.EN)
    } catch (err) {
      this.logger.error(`Error while updating post category ${err}`)
      throw new BadRequestException('post category is NOT_UPDATED')
    }

    return this.findOne(id)
  }

  private async saveTranslate(category: PostCategory, field: string, value: string, lang: LANG) {
    const exist = await this.postCategoryTranslateRepository.findOne({
      where: {
        entity_id: { id: category.id },
        field,
        lang,
      },
    })

    if (exist) {
      await this.postCategoryTranslateRepository.update(exist.id, { value })
    } else {
      await this.postCategoryTranslateRepository.save({
        entity_id: category,
        field,
        value,
        lang,
      })
    }
  }

  async delete(id: number) {
    const deleteResult = await this.postCategoryRepository.delete(id)
    if (deleteResult.affected === 0) throw new NotFoundException('post category is NOT_FOUND')
    return { message: 'SUCCESS' }
  }

  async createTranslates(createTranslatesDto: PostCategoryCreateTranslateDto[]) {
    if (!createTranslatesDto?.length) return null
    const results: PostCategoryTranslate[] = []
    for (const translateDto of createTranslatesDto) {
      const translateData = this.postCategoryTranslateRepository.create({
        ...translateDto,
        entity_id: { id: translateDto.entity_id } as any,
      })
      const savedTranslate = await this.postCategoryTranslateRepository.save(translateData)
      results.push(savedTranslate)
    }
    return results
  }

  async updateTranslates(updateTranslatesDto: PostCategoryUpdateTranslateDto[]) {
    const results: PostCategoryTranslate[] = []
    for (const translateDto of updateTranslatesDto) {
      const updateResult = await this.postCategoryTranslateRepository.update(translateDto.id, { ...translateDto })
      if (updateResult.affected === 0) throw new NotFoundException('post category translate is NOT_FOUND')
      const updatedTranslate = await this.postCategoryTranslateRepository.findOne({
        where: { id: translateDto.id },
      })
      if (updatedTranslate) results.push(updatedTranslate)
    }
    return results
  }

  async deleteTranslate(id: number) {
    const deleteResult = await this.postCategoryTranslateRepository.delete(id)
    if (deleteResult.affected === 0) throw new NotFoundException('post category translate is NOT_FOUND')
    return { message: 'OK' }
  }
}
