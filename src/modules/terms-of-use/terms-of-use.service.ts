import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { Repository } from 'typeorm'

import { CreateTermsOfUseDto } from './dto/create-terms-of-use.dto'
import { UpdateTermsOfUseDto } from './dto/update-terms-of-use.dto'
import { TermsOfUse } from './entities/terms-of-use.entity'

@Injectable()
export class TermsOfUseService {
  private readonly logger = new Logger(TermsOfUseService.name)

  constructor(
    @InjectRepository(TermsOfUse)
    private readonly repo: Repository<TermsOfUse>
  ) {}

  async create(dto: CreateTermsOfUseDto): Promise<TermsOfUse> {
    const entity = this.repo.create(dto)
    try {
      return await this.repo.save(entity)
    } catch (error) {
      this.logger.error(`Error creating terms-of-use: ${error.message}`)
      throw new BadRequestException('entity of terms-of-use NOT_CREATED')
    }
  }

  async findAll(take: number, skip: number): Promise<{ entities: TermsOfUse[]; count: number }> {
    const entities = await this.repo.find({
      take,
      skip,
      order: { created_at: 'DESC' },
    })
    const count = await this.repo.count()
    return { entities, count }
  }

  async findOne(lang: LANG): Promise<TermsOfUse> {
    const entity = await this.repo.findOne({ where: { lang } })
    if (!entity) throw new NotFoundException('entity of terms-of-use NOT_FOUND')
    return entity
  }

  async update(dto: UpdateTermsOfUseDto): Promise<TermsOfUse> {
    const { lang } = dto
    const result = await this.repo.update({ lang }, dto)

    if (result.affected === 0) {
      const created = this.repo.create(dto)
      return await this.repo.save(created)
    }

    const entity = await this.repo.findOne({ where: { lang } })
    if (!entity) throw new NotFoundException('entity of terms-of-use NOT_FOUND')
    return entity
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.repo.delete(id)
      if (result.affected === 0) throw new NotFoundException('entity of terms-of-use NOT_FOUND')
    } catch (err) {
      if (err.code === '23503') {
        throw new BadRequestException('entity of terms-of-use HAS_CHILDS')
      }
      this.logger.error(`Error while deleting terms-of-use entity \n ${err}`)
      throw err
    }

    return { message: 'SUCCESS' }
  }
}
