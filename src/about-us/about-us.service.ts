import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { CreateAboutUsDto } from './dto/create-about-us.dto'
import { UpdateAboutUsDto } from './dto/update-about-us.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { AboutUs } from './entities/about-us.entity'
import { Repository } from 'typeorm'
import { LANG } from 'src/common/enums/translation.enum'

@Injectable()
export class AboutUsService {
  private readonly logger = new Logger(AboutUsService.name)

  constructor(
    @InjectRepository(AboutUs)
    private readonly countryRepo: Repository<AboutUs>
  ) {}

  async create(dto: CreateAboutUsDto): Promise<AboutUs> {
    const entity = this.countryRepo.create(dto)
    try {
      const savedEntity = await this.countryRepo.save(entity)
      return savedEntity
    } catch (error) {
      this.logger.error(`Error creating country: ${error.message}`)
      throw new BadRequestException('entity of product-promotion NOT_CREATED')
    }
  }

  async findAll(
    take: number,
    skip: number
  ): Promise<{ entities: AboutUs[]; count: number }> {
    const entities = await this.countryRepo.find({
      take,
      skip,
      order: { created_at: 'DESC' }
    })

    const count = await this.countryRepo.count()

    return { entities, count }
  }

  async findOne(lang: LANG): Promise<AboutUs> {
    const entity = await this.countryRepo.findOne({
      where: { lang }
    })

    if (!entity) throw new NotFoundException('entity of about-us NOT_FOUND')

    return entity
  }

  async update(dto: UpdateAboutUsDto): Promise<AboutUs | null> {
    const { lang } = dto
    const result = await this.countryRepo.update({ lang }, dto)

    if (result.affected === 0) {
      const created = this.countryRepo.create(dto)
      return await this.countryRepo.save(created)
    }

    const entity = await this.countryRepo.findOne({ where: { lang } })

    return entity
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.countryRepo.delete(id)
      if (result.affected === 0) {
        throw new NotFoundException('entity of about-us NOT_FOUND')
      }
    } catch (err) {
      if (err.code === '23503') {
        throw new BadRequestException('entity of about-us HAS_CHILDS')
      }

      this.logger.error(`Error while deleting about us entity \n ${err}`)
      throw err
    }

    return { message: 'SUCCESS' }
  }
}
