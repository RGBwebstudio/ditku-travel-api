import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Discount } from './entities/discount.entity'
import { CreateDiscountDto } from './dto/create-discount.dto'
import { UpdateDiscountDto } from './dto/update-discount.dto'

@Injectable()
export class DiscountService {
  private readonly logger = new Logger(DiscountService.name)

  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>
  ) {}

  async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
    const entity = this.discountRepository.create(
      createDiscountDto as Partial<Discount>
    )
    return (await this.discountRepository.save(entity)) as unknown as Discount
  }

  async findAll(): Promise<Discount[]> {
    return await this.discountRepository
      .createQueryBuilder('discount')
      .leftJoinAndSelect('discount.segment_id', 'segment')
      .leftJoinAndSelect('discount.price_type_id', 'price_type')
      .leftJoinAndSelect('discount.discount_conditions', 'discount_conditions')
      .orderBy('discount.created_at', 'DESC')
      .getMany()
  }

  async findOne(idOrCustomId: number | string): Promise<Discount> {
    const qb = this.discountRepository
      .createQueryBuilder('discount')
      .leftJoinAndSelect('discount.segment_id', 'segment')
      .leftJoinAndSelect('discount.price_type_id', 'price_type')
      .leftJoinAndSelect('discount.discount_conditions', 'discount_conditions')

    if (typeof idOrCustomId === 'number') {
      qb.where('discount.id = :id', { id: idOrCustomId })
    } else {
      qb.where('discount.custom_id = :custom_id', { custom_id: idOrCustomId })
    }

    const result = await qb.getOne()
    if (!result) throw new Error('Discount not found')
    return result
  }

  async update(
    id: number,
    updateDiscountDto: UpdateDiscountDto
  ): Promise<Discount> {
    await this.discountRepository.update(
      id,
      updateDiscountDto as Partial<Discount>
    )
    return await this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    await this.discountRepository.delete(id)
  }
}
