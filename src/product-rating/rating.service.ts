import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Rating } from './entities/rating.entity'
import { RatingCreateDto } from './dto/rating-create.dto'
import { RatingUpdateDto } from './dto/rating-update.dto'
import { LANG } from 'src/common/enums/translation.enum'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { OrderItem } from 'src/order/entities/order-item.entity'
import { OrderStatus } from 'src/common/enums/order.enum'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { AuthenticatedRequest } from 'src/user/types/auth-request.types'

@Injectable()
export class RatingService {
  private readonly logger = new Logger(RatingService.name)

  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepo: Repository<Rating>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    private jwtService: JwtService
  ) {}

  async findOne(id: number, lang: LANG): Promise<Rating | null> {
    const entity = await this.ratingRepo.findOne({
      where: { id }
    })

    if (!entity) throw new NotFoundException('rating is NOT_FOUND')

    const mappedEntity = applyTranslations([entity], lang)

    return mappedEntity[0] as Rating
  }

  async getUserEstimate(productId: number, req: AuthenticatedRequest) {
    const userId = req.user.id

    const ratingData = await this.ratingRepo.findOne({
      where: {
        product_id: { id: productId },
        user_id: { id: userId }
      },
      relations: ['product_id', 'user_id']
    })

    return ratingData as Rating
  }

  async setRating(
    dto: RatingCreateDto,
    req: AuthenticatedRequest
  ): Promise<Rating> {
    const userId = req.user.id

    const productId =
      typeof dto.product_id === 'number' ? dto.product_id : dto.product_id.id

    const hasPurchased = await this.checkUserPurchasedProduct(userId, productId)

    if (!hasPurchased) {
      throw new ForbiddenException('user has NOT_PURCHASED_PRODUCT')
    }

    // Шукаємо існуючий рейтинг користувача для цього товару
    const existingRating = await this.ratingRepo.findOne({
      where: {
        product_id: { id: productId },
        user_id: { id: userId }
      },
      relations: ['product_id', 'user_id']
    })

    if (existingRating) {
      existingRating.rating = dto.rating

      try {
        return (await this.ratingRepo.save(existingRating)) as Rating
      } catch (error) {
        this.logger.error(`Error while updating existing rating: ${error}`)
        throw new BadRequestException('rating is NOT_UPDATED')
      }
    }

    const data = this.ratingRepo.create({
      ...dto,
      user_id: { id: userId } as any
    })

    try {
      return (await this.ratingRepo.save(data)) as Rating
    } catch (error) {
      this.logger.error(`Error while creating rating: ${error}`)
      throw new BadRequestException('rating is NOT_CREATED')
    }
  }

  private async checkUserPurchasedProduct(
    userId: number,
    productId: number
  ): Promise<boolean> {
    const orderItem = await this.orderItemRepo
      .createQueryBuilder('orderItem')
      .innerJoin('orderItem.order_id', 'order')
      .innerJoin('orderItem.product_id', 'product')
      .where('order.user_id = :userId', { userId })
      .andWhere('product.id = :productId', { productId })
      .andWhere('order.status IN (:...statuses)', {
        statuses: [OrderStatus.SUCCESS]
      })
      .getOne()

    return !!orderItem
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
    const result = await this.ratingRepo.update(id, { ...dto })

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
      relations: ['product_id', 'user_id'],
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
