import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { ProductPromotionCreateDto } from './dto/product-promotion-create.dto'
import { ProductPromotionUpdateDto } from './dto/product-promotion-update.dto'
import { ProductPromotionTranslate } from './entities/product-promotion-translate.entity'
import { ProductPromotiontCreateTranslateDto } from './dto/product-promotion-create-translate.dto'
import { ProductPromotionUpdateTranslateDto } from './dto/product-promotion-update-translate.dto'
import { LANG } from 'src/common/enums/translation.enum'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { ProductPromotion } from './entities/product-promotion.entity'
import { Product } from 'src/product/entities/product.entity'

@Injectable()
export class ProductPromotionService {
  private readonly logger = new Logger(ProductPromotionService.name)

  constructor(
    @InjectRepository(ProductPromotion)
    private readonly productPromotionRepo: Repository<ProductPromotion>,
    @InjectRepository(ProductPromotionTranslate)
    private readonly entityTranslateRepo: Repository<ProductPromotionTranslate>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>
  ) {}

  async findOne(id: number, lang: LANG): Promise<ProductPromotion | null> {
    const entity = await this.productPromotionRepo.findOne({
      where: { id },
      relations: ['translates']
    })

    if (!entity) throw new NotFoundException('product-promotion is NOT_FOUND')

    const mappedEntity = applyTranslations([entity], lang)

    return mappedEntity[0]
  }

  async create(dto: ProductPromotionCreateDto): Promise<ProductPromotion> {
    const { products } = dto

    // Ensure title uniqueness
    const exists = await this.productPromotionRepo
      .createQueryBuilder('productPromotion')
      .where('LOWER(productPromotion.title) = :title', {
        title: (dto.title || '').toLowerCase()
      })
      .getOne()

    if (exists) {
      throw new BadRequestException('NAME_ALREADY_RESERVED')
    }

    const data = this.productPromotionRepo.create(dto)

    let list: Product[] = []

    if (products.length) {
      list = await this.productRepo.find({
        where: { id: In(products) }
      })
    }

    if (list?.length) {
      data.products = list
    } else {
      throw new NotFoundException('product-promotion is NOT_FOUND')
    }

    try {
      return await this.productPromotionRepo.save(data)
    } catch (err) {
      this.logger.error(`Error while creating product promotion: ${err}`)
      throw new BadRequestException('product-promotion is NOT_CREATED')
    }
  }

  async findAllList(lang: LANG): Promise<{ entities: ProductPromotion[] }> {
    const entities = await this.productPromotionRepo.find({
      order: { created_at: 'DESC' },
      relations: ['translates']
    })

    const mappedEntities = applyTranslations(entities, lang)

    return { entities: mappedEntities }
  }

  async findAll(
    take: number,
    skip: number,
    lang: LANG
  ): Promise<{ entities: ProductPromotion[]; count: number }> {
    const entities = await this.productPromotionRepo.find({
      take,
      skip,
      order: { created_at: 'DESC' },
      relations: ['translates']
    })

    const mappedEntities = applyTranslations(entities, lang)

    const count = await this.productPromotionRepo.count()

    return { entities: mappedEntities, count }
  }

  async update(
    id: number,
    dto: ProductPromotionUpdateDto
  ): Promise<ProductPromotion | null> {
    const { products, ...rest } = dto

    const entity = await this.productPromotionRepo.findOne({
      where: { id },
      relations: ['products']
    })

    if (!entity) throw new NotFoundException('product-promotion is NOT_FOUND')

    if (products) {
      const list = await this.productRepo.find({ where: { id: In(products) } })

      if (!list.length) {
        throw new NotFoundException('product is NOT_FOUND')
      } else {
        entity.products = list
      }
    }

    Object.assign(entity, rest)

    const result = await this.productPromotionRepo.save(entity)

    return result
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.productPromotionRepo.delete(id)

      if (result.affected === 0) {
        throw new NotFoundException('product-promotion is NOT_FOUND')
      }
    } catch (err) {
      if (err.code === '23503') {
        throw new BadRequestException('product-promotion HAS_CHILDS')
      }

      this.logger.error(
        `Error while deleting product-promotion entity \n ${err}`
      )
      throw err
    }

    return { message: 'SUCCESS' }
  }

  async createTranslates(
    dto: ProductPromotiontCreateTranslateDto[]
  ): Promise<ProductPromotionTranslate[] | null> {
    if (dto?.length) {
      const results: ProductPromotionTranslate[] = []

      for (const translate of dto) {
        const data = this.entityTranslateRepo.create(translate)
        const result = await this.entityTranslateRepo.save(data)
        results.push(result)
      }

      return results
    }
    return null
  }

  async updateTranslates(
    dto: ProductPromotionUpdateTranslateDto[]
  ): Promise<ProductPromotionTranslate[] | null> {
    const results: ProductPromotionTranslate[] = []

    for (const translate of dto) {
      const result = await this.entityTranslateRepo.update(translate.id, {
        ...translate
      })

      if (result.affected === 0)
        throw new NotFoundException('product-promotion translate is NOT_FOUND')

      const updatedEntityTranslate = await this.entityTranslateRepo.findOne({
        where: { id: translate.id }
      })

      if (updatedEntityTranslate) results.push(updatedEntityTranslate)
    }

    return results
  }

  async deleteTranslate(
    id: number
  ): Promise<{ message: string } | NotFoundException> {
    const result = await this.entityTranslateRepo.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException('product-promotion translate is NOT_FOUND')
    }

    return { message: 'OK' }
  }
}
