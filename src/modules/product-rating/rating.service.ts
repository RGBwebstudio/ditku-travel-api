import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Rating } from './entities/rating.entity'
import { RatingCreateDto } from './dto/rating-create.dto'
import { RatingUpdateDto } from './dto/rating-update.dto'
import { LANG } from 'src/common/enums/translation.enum'
import { applyTranslations } from 'src/common/utils/apply-translates.util'

@Injectable()
export class RatingService {
  private readonly logger = new Logger(RatingService.name)

  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepo: Repository<Rating>
  ) {}

  async findOne(id: number, lang: LANG): Promise<Rating | null> {
    const entity = await this.ratingRepo.findOne({
      where: { id }
    })

    if (!entity) throw new NotFoundException('rating is NOT_FOUND')

    const mappedEntity = applyTranslations([entity], lang)

    return mappedEntity[0]
  }

  async setRating(dto: RatingCreateDto): Promise<Rating> {
    const productId =
      typeof dto.product_id === 'number' ? dto.product_id : dto.product_id.id

    const data = this.ratingRepo.create({
      name: dto.name,
      review: dto.review,
      rating: String(dto.rating),
      product_id: { id: productId }
    })

    try {
      return await this.ratingRepo.save(data)
    } catch (error) {
      this.logger.error(`Error while creating rating: ${error}`)
      throw new BadRequestException('rating is NOT_CREATED')
    }
  }

  async findAllList(lang: LANG): Promise<{ entities: Rating[] }> {
    const entities = await this.ratingRepo.find({
      order: { created_at: 'DESC' }
    })

    const mappedEntities = applyTranslations(entities, lang)

    return { entities: mappedEntities }
  }

  async findAll(
    take: number,
    skip: number,
    lang: LANG
  ): Promise<{ entities: Rating[]; count: number }> {
    const entities = await this.ratingRepo.find({
      take,
      skip,
      order: { created_at: 'DESC' }
    })

    const mappedEntities = applyTranslations(entities, lang)

    const count = await this.ratingRepo.count()

    return { entities: mappedEntities, count }
  }

  async update(id: number, dto: RatingUpdateDto): Promise<Rating | null> {
    const payload: any = { ...dto }
    if (typeof dto.rating !== 'undefined') payload.rating = String(dto.rating)

    const result = await this.ratingRepo.update(id, payload)

    if (result.affected === 0)
      throw new NotFoundException('rating is NOT_FOUND')

    const updatedCategory = await this.ratingRepo.findOne({
      where: { id }
    })

    return updatedCategory as Rating
  }

  async getRatingsByProduct(productId: number): Promise<{
    ratings: Rating[]
    averageRating: number
    totalRatings: number
  }> {
    const ratings = await this.ratingRepo.find({
      where: { product_id: { id: productId } },
      relations: ['product_id'],
      order: { created_at: 'DESC' }
    })

    if (!ratings || ratings.length === 0) {
      return {
        ratings: [],
        averageRating: 0,
        totalRatings: 0
      }
    }

    const totalRating = ratings.reduce(
      (sum: number, rating: Rating) => sum + Number(rating.rating),
      0
    )
    const averageRating = Math.round((totalRating / ratings.length) * 10) / 10

    return {
      ratings,
      averageRating,
      totalRatings: ratings.length
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
