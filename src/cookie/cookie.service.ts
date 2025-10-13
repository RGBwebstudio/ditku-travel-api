import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Cookie } from './entities/cookie.entity'
import { CreateCookieDto } from './dto/create-cookie.dto'
import { UpdateCookieDto } from './dto/update-cookie.dto'
import { LANG } from 'src/common/enums/translation.enum'

@Injectable()
export class CookieService {
  private readonly logger = new Logger(CookieService.name)

  constructor(
    @InjectRepository(Cookie)
    private readonly repo: Repository<Cookie>
  ) {}

  async create(dto: CreateCookieDto): Promise<Cookie> {
    const entity = this.repo.create(dto)
    try {
      return await this.repo.save(entity)
    } catch (error) {
      this.logger.error(`Error creating cookie: ${error.message}`)
      throw new BadRequestException('entity of cookie NOT_CREATED')
    }
  }

  async findAll(
    take: number,
    skip: number
  ): Promise<{ entities: Cookie[]; count: number }> {
    const entities = await this.repo.find({
      take,
      skip,
      order: { created_at: 'DESC' }
    })
    const count = await this.repo.count()
    return { entities, count }
  }

  async findOne(lang: LANG): Promise<Cookie> {
    const entity = await this.repo.findOne({ where: { lang } })
    if (!entity) throw new NotFoundException('entity of cookie NOT_FOUND')
    return entity
  }

  async update(dto: UpdateCookieDto): Promise<Cookie | null> {
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
        throw new NotFoundException('entity of cookie NOT_FOUND')
    } catch (err) {
      if (err.code === '23503') {
        throw new BadRequestException('entity of cookie HAS_CHILDS')
      }
      this.logger.error(`Error while deleting cookie entity \n ${err}`)
      throw err
    }

    return { message: 'SUCCESS' }
  }
}
