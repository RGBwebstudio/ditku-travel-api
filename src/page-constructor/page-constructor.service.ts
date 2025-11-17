import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PageConstructor, PageType } from './entities/page-constructor.entity'
import { CreatePageConstructorDto } from './dto/create-page-constructor.dto'
import { UpdatePageConstructorDto } from './dto/update-page-constructor.dto'
import { LANG } from 'src/common/enums/translation.enum'

@Injectable()
export class PageConstructorService {
  private readonly logger = new Logger(PageConstructorService.name)

  constructor(
    @InjectRepository(PageConstructor)
    private readonly repo: Repository<PageConstructor>
  ) {}

  async create(dto: CreatePageConstructorDto): Promise<PageConstructor> {
    const entity = this.repo.create(dto)
    try {
      const saved = await this.repo.save(entity)
      return saved
    } catch (error) {
      this.logger.error(`Error creating page-constructor: ${error.message}`)
      throw new BadRequestException('entity of page-constructor NOT_CREATED')
    }
  }

  async findAll(
    take: number,
    skip: number
  ): Promise<{ entities: PageConstructor[]; count: number }> {
    const entities = await this.repo.find({
      take,
      skip,
      order: { created_at: 'DESC' }
    })
    const count = await this.repo.count()
    return { entities, count }
  }

  async findOne(lang: LANG, page_type?: PageType): Promise<PageConstructor[]> {
    const where: Partial<PageConstructor> = { lang }
    if (page_type) where.page_type = page_type

    const entities = await this.repo.find({
      where,
      order: { created_at: 'DESC' }
    })
    if (!entities || entities.length === 0)
      throw new NotFoundException('entity of page-constructor NOT_FOUND')
    return entities
  }

  async update(
    dto: UpdatePageConstructorDto & { id?: number }
  ): Promise<PageConstructor | null> {
    const { id } = dto
    if (!id) {
      throw new BadRequestException('id required for update')
    }

    const result = await this.repo.update(id, dto)
    if (result.affected === 0)
      throw new NotFoundException('entity of page-constructor NOT_FOUND')

    const entity = await this.repo.findOne({ where: { id } })
    return entity
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.repo.delete(id)
      if (result.affected === 0) {
        throw new NotFoundException('entity of page-constructor NOT_FOUND')
      }
    } catch (err) {
      const e = err as { code?: string; message?: string }
      if (e.code === '23503') {
        throw new BadRequestException('entity of page-constructor HAS_CHILDS')
      }

      this.logger.error(
        e.message ?? 'Error while deleting page-constructor entity'
      )
      throw err
    }

    return { message: 'SUCCESS' }
  }
}
