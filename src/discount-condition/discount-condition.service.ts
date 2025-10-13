import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DiscountCondition } from './entities/discount-condition.entity'
import { CreateDiscountConditionDto } from './dto/create-discount-condition.dto'
import { UpdateDiscountConditionDto } from './dto/update-discount-condition.dto'
import { Discount } from 'src/discount/entities/discount.entity'

@Injectable()
export class DiscountConditionService {
  private readonly logger = new Logger(DiscountConditionService.name)

  constructor(
    @InjectRepository(DiscountCondition)
    private readonly discountConditionRepository: Repository<DiscountCondition>,
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>
  ) {}

  async create(
    createDiscountConditionDto: CreateDiscountConditionDto
  ): Promise<DiscountCondition> {
    const entity = this.discountConditionRepository.create(
      createDiscountConditionDto as Partial<DiscountCondition>
    )
    return (await this.discountConditionRepository.save(
      entity
    )) as unknown as DiscountCondition
  }

  async findAll(): Promise<DiscountCondition[]> {
    return await this.discountConditionRepository.find({
      relations: ['discount_id'],
      order: { created_at: 'DESC' }
    })
  }

  async findOne(id: number): Promise<DiscountCondition> {
    return await this.discountConditionRepository.findOneOrFail({
      where: { id },
      relations: ['discount_id']
    })
  }

  async update(
    id: number,
    updateDiscountConditionDto: UpdateDiscountConditionDto
  ): Promise<DiscountCondition> {
    await this.discountConditionRepository.update(
      id,
      updateDiscountConditionDto as Partial<DiscountCondition>
    )
    return await this.findOne(id)
  }

  async delete(id: number): Promise<void> {
    await this.discountConditionRepository.delete(id)
  }
}
