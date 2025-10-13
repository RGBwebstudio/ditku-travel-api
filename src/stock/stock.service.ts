import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Stock } from './entities/stock.entity'
import { StockCreateDto } from './dto/stock-create.dto'
import { StockUpdateDto } from './dto/stock-update.dto'
import { LANG } from 'src/common/enums/translation.enum'
import { applyTranslations } from 'src/common/utils/apply-translates.util'

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name)

  constructor(
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>
  ) {}

  async findOne(id: number, lang: LANG): Promise<Stock | null> {
    const entity = await this.stockRepo.findOne({
      where: { id },
      relations: ['product']
    })

    if (!entity) throw new NotFoundException('stock is NOT_FOUND')

    const mappedEntity = applyTranslations([entity], lang)

    return mappedEntity[0]
  }

  async create(dto: StockCreateDto): Promise<Stock> {
    const data = this.stockRepo.create(dto)

    try {
      return await this.stockRepo.save(data)
    } catch (error) {
      this.logger.error(`Error while creating stock: ${error}`)
      throw new BadRequestException('stock is NOT_CREATED')
    }
  }

  async findAllList(lang: LANG): Promise<{ entities: Stock[] }> {
    const entities = await this.stockRepo.find({
      order: { created_at: 'DESC' },
      relations: ['product']
    })

    const mappedEntities = applyTranslations(entities, lang)

    return { entities: mappedEntities }
  }

  async findAll(
    take: number,
    skip: number,
    lang: LANG
  ): Promise<{ entities: Stock[]; count: number }> {
    const entities = await this.stockRepo.find({
      take,
      skip,
      relations: ['product'],
      order: { created_at: 'DESC' }
    })

    const mappedEntities = applyTranslations(entities, lang)

    const count = await this.stockRepo.count()

    return { entities: mappedEntities, count }
  }

  async update(id: number, dto: StockUpdateDto): Promise<Stock | null> {
    const result = await this.stockRepo.update(id, { ...dto })

    if (result.affected === 0) throw new NotFoundException('stock is NOT_FOUND')

    const updatedCategory = await this.stockRepo.findOne({
      where: { id }
    })

    return updatedCategory
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.stockRepo.delete(id)

      if (result.affected === 0) {
        throw new NotFoundException('stock is NOT_FOUND')
      }
    } catch (err) {
      if (err.code === '23503') {
        throw new BadRequestException('stock HAS_CHILDS')
      }

      this.logger.error(`Error while deleting stock \n ${err}`)
      throw err
    }

    return { message: 'SUCCESS' }
  }
}
