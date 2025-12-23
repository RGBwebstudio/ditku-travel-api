import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { Repository } from 'typeorm'

import { CreateMainPageDto } from './dto/create-main-page.dto'
import { UpdateMainPageDto } from './dto/update-main-page.dto'
import { MainPage } from './entities/main-page.entity'

@Injectable()
export class MainPageService {
  private readonly logger = new Logger(MainPageService.name)

  constructor(
    @InjectRepository(MainPage)
    private readonly countryRepo: Repository<MainPage>
  ) {}

  async create(dto: CreateMainPageDto): Promise<MainPage> {
    const entity = this.countryRepo.create(dto)
    try {
      const savedEntity = await this.countryRepo.save(entity)
      return savedEntity
    } catch (error) {
      this.logger.error(`Error creating main-page: ${error.message}`)
      throw new BadRequestException('entity of main-page NOT_CREATED')
    }
  }

  async findAll(take: number, skip: number): Promise<{ entities: MainPage[]; count: number }> {
    const entities = await this.countryRepo.find({
      take,
      skip,
      order: { created_at: 'DESC' },
    })

    const count = await this.countryRepo.count()

    return { entities, count }
  }

  async findOne(lang: LANG): Promise<MainPage> {
    const entity = await this.countryRepo.findOne({
      where: { lang },
    })

    if (!entity) throw new NotFoundException('entity of main-page NOT_FOUND')

    return entity
  }

  async update(dto: UpdateMainPageDto): Promise<MainPage | null> {
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
        throw new NotFoundException('entity of main-page NOT_FOUND')
      }
    } catch (err) {
      if (err.code === '23503') {
        throw new BadRequestException('entity of main-page HAS_CHILDS')
      }

      this.logger.error(`Error while deleting main-page entity \n ${err}`)
      throw err
    }

    return { message: 'SUCCESS' }
  }
}
