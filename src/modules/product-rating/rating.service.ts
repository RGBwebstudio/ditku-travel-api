import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { Repository } from 'typeorm'

import { RatingCreateDto } from './dto/rating-create.dto'
import { RatingUpdateDto } from './dto/rating-update.dto'
import { RatingTranslate } from './entities/rating-translate.entity'
import { Rating } from './entities/rating.entity'

@Injectable()
export class RatingService {
  private readonly logger = new Logger(RatingService.name)

  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepo: Repository<Rating>,
    @InjectRepository(RatingTranslate)
    private readonly repoTranslate: Repository<RatingTranslate>
  ) {}

  async findOne(id: number, lang: LANG): Promise<Rating | null> {
    const entity = await this.ratingRepo.findOne({
      where: { id },
      relations: ['translates'],
    })

    if (!entity) throw new NotFoundException('rating is NOT_FOUND')

    const mappedEntity = applyTranslations([entity], lang)

    return mappedEntity[0]
  }

  async setRating(dto: RatingCreateDto): Promise<Rating> {
    const productId = typeof dto.product_id === 'number' ? dto.product_id : dto.product_id.id

    const data = this.ratingRepo.create({
      name: dto.name,
      review: dto.review,
      rating: String(dto.rating),
      product_id: { id: productId },
    })

    try {
      const saved = await this.ratingRepo.save(data)

      const translations: any[] = []
      const langFields = ['review']

      const payload: any = dto

      for (const field of langFields) {
        if (payload.text_ua) {
          translations.push({
            entity_id: saved,
            lang: LANG.UA,
            field: field,
            value: payload.text_ua,
          })
        }
        if (payload.text_en) {
          translations.push({
            entity_id: saved,
            lang: LANG.EN,
            field: field,
            value: payload.text_en,
          })
        }
      }

      if (translations.length > 0) {
        await this.repoTranslate.save(translations)
      }

      const savedWithRelations = await this.ratingRepo.findOne({
        where: { id: saved.id },
        relations: ['translates'],
      })

      if (!savedWithRelations) {
        throw new BadRequestException('rating is NOT_CREATED')
      }

      return savedWithRelations
    } catch (error) {
      this.logger.error(`Error while creating rating: ${error}`)
      throw new BadRequestException('rating is NOT_CREATED')
    }
  }

  async findAllList(lang: LANG): Promise<{ entities: Rating[] }> {
    const entities = await this.ratingRepo.find({
      order: { created_at: 'DESC' },
      relations: ['translates'],
    })

    const mappedEntities = applyTranslations(entities, lang)

    return { entities: mappedEntities }
  }

  async findAll(take: number, skip: number, lang: LANG): Promise<{ entities: Rating[]; count: number }> {
    const entities = await this.ratingRepo.find({
      take,
      skip,
      order: { created_at: 'DESC' },
      relations: ['translates'],
    })

    const mappedEntities = applyTranslations(entities, lang)

    const count = await this.ratingRepo.count()

    return { entities: mappedEntities, count }
  }

  async update(id: number, dto: RatingUpdateDto): Promise<Rating | null> {
    const { text_ua, text_en, ...rest } = dto
    // Initial payload from 'rest' (excludes text_ua, text_en)
    const payload: any = { ...rest }
    if (typeof dto.rating !== 'undefined') payload.rating = String(dto.rating)

    // Remove unknown properties that might come from dto
    delete payload.author
    delete payload.text
    delete payload.translates

    const result = await this.ratingRepo.update(id, payload)

    if (result.affected === 0) throw new NotFoundException('rating is NOT_FOUND')

    const langFields = ['review']

    for (const field of langFields) {
      if (text_ua) {
        await this.repoTranslate.delete({
          entity_id: { id },
          lang: LANG.UA,
          field: field,
        })
        await this.repoTranslate.save({
          entity_id: { id } as Rating,
          lang: LANG.UA,
          field: field,
          value: text_ua,
        })
      }
      if (text_en) {
        await this.repoTranslate.delete({
          entity_id: { id },
          lang: LANG.EN,
          field: field,
        })
        await this.repoTranslate.save({
          entity_id: { id } as Rating,
          lang: LANG.EN,
          field: field,
          value: text_en,
        })
      }
    }

    const updatedEntity = await this.ratingRepo.findOne({
      where: { id },
      relations: ['translates'],
    })

    return updatedEntity
  }

  async getRatingsByProduct(
    productId: number,
    lang: LANG = LANG.UA
  ): Promise<{
    ratings: Rating[]
    averageRating: number
    totalRatings: number
  }> {
    const ratings = await this.ratingRepo.find({
      where: { product_id: { id: productId } },
      relations: ['product_id', 'translates'],
      order: { created_at: 'DESC' },
    })

    if (!ratings || ratings.length === 0) {
      return {
        ratings: [],
        averageRating: 0,
        totalRatings: 0,
      }
    }

    const mappedRatings = applyTranslations(ratings, lang)

    const totalRating = ratings.reduce((sum: number, rating: Rating) => sum + Number(rating.rating), 0)
    const averageRating = Math.round((totalRating / ratings.length) * 10) / 10

    return {
      ratings: mappedRatings,
      averageRating,
      totalRatings: ratings.length,
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.ratingRepo.delete(id)

      if (result.affected === 0) {
        throw new NotFoundException('rating is NOT_FOUND')
      }
    } catch (err) {
      if (err.code === '23503') {
        throw new BadRequestException('rating HAS_CHILDS')
      }
      this.logger.error(`Error while deleting rating \n ${err}`)
    }

    return { message: 'SUCCESS' }
  }
}
