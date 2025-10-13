import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Price } from './entities/price.entity'
import { CreatePriceDto } from './dto/create-price.dto'
import { UpdatePriceDto } from './dto/update-price.dto'

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name)

  constructor(
    @InjectRepository(Price)
    private readonly priceRepo: Repository<Price>
  ) {}

  async create(dto: CreatePriceDto): Promise<Price> {
    const entity = this.priceRepo.create(dto)

    return await this.priceRepo.save(entity)
  }

  async findAll(): Promise<Price[]> {
    return await this.priceRepo.find({ relations: ['products'] })
  }

  async findOne(idOrCustomId: number | string): Promise<Price> {
    return await this.priceRepo.findOneOrFail({
      where: [
        { id: typeof idOrCustomId === 'number' ? idOrCustomId : undefined },
        {
          custom_id: typeof idOrCustomId === 'string' ? idOrCustomId : undefined
        }
      ],
      relations: ['product_prices']
    })
  }

  async update(id: number, dto: UpdatePriceDto): Promise<Price> {
    const payload: any = { ...dto }
    if (payload.value != null) payload.value = payload.value.toString()
    await this.priceRepo.update(id, payload)
    return await this.findOne(id)
  }

  async remove(id: number): Promise<void> {
    await this.priceRepo.delete(id)
  }
}
