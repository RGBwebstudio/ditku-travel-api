import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Content } from './entities/content.entity'
import { CreateContentDto } from './dto/create-content.dto'
import { UpdateContentDto } from './dto/update-content.dto'
import { LANG } from 'src/common/enums/translation.enum'

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name)

  constructor(
    @InjectRepository(Content)
    private readonly repo: Repository<Content>
  ) {}

  async create(dto: CreateContentDto): Promise<Content> {
    const entity = this.repo.create(dto)
    try {
      return await this.repo.save(entity)
    } catch (error) {
      this.logger.error(`Error creating content: ${error.message}`)
      throw new BadRequestException('entity of content NOT_CREATED')
    }
  }

  async findAll(
    take: number,
    skip: number
  ): Promise<{ entities: Content[]; count: number }> {
    const entities = await this.repo.find({
      take,
      skip,
      order: { created_at: 'DESC' }
    })
    const count = await this.repo.count()
    return { entities, count }
  }

  async findOne(lang: LANG): Promise<Content> {
    const entity = await this.repo.findOne({ where: { lang } })
    if (!entity) throw new NotFoundException('entity of content NOT_FOUND')
    return entity
  }

  async update(dto: UpdateContentDto): Promise<Content | null> {
    const { lang } = dto
    const result = await this.repo.update({ lang }, dto)

    if (result.affected === 0) {
      const created = this.repo.create(dto)
      return await this.repo.save(created)
    }

    const entity = await this.repo.findOne({ where: { lang } })
    return entity
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.repo.delete(id)
      if (result.affected === 0)
        throw new NotFoundException('entity of content NOT_FOUND')
    } catch (err) {
      if (err.code === '23503') {
        throw new BadRequestException('entity of content HAS_CHILDS')
      }
      this.logger.error(`Error while deleting content entity \n ${err}`)
      throw err
    }

    return { message: 'SUCCESS' }
  }
}
