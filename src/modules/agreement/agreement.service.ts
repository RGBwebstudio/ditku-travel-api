import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { Repository } from 'typeorm'

import { CreateAgreementDto } from './dto/create-agreement.dto'
import { UpdateAgreementDto } from './dto/update-agreement.dto'
import { Agreement } from './entities/agreement.entity'

@Injectable()
export class AgreementService {
  private readonly logger = new Logger(AgreementService.name)

  constructor(
    @InjectRepository(Agreement)
    private readonly repo: Repository<Agreement>
  ) {}

  async create(dto: CreateAgreementDto): Promise<Agreement> {
    const entity = this.repo.create(dto)
    try {
      return await this.repo.save(entity)
    } catch (error) {
      this.logger.error(`Error creating agreement: ${error.message}`)
      throw new BadRequestException('entity of agreement NOT_CREATED')
    }
  }

  async findAll(take: number, skip: number): Promise<{ entities: Agreement[]; count: number }> {
    const entities = await this.repo.find({
      take,
      skip,
      order: { created_at: 'DESC' },
    })
    const count = await this.repo.count()
    return { entities, count }
  }

  async findOne(lang: LANG): Promise<Agreement> {
    const entity = await this.repo.findOne({ where: { lang } })
    if (!entity) throw new NotFoundException('entity of agreement NOT_FOUND')
    return entity
  }

  async update(dto: UpdateAgreementDto): Promise<Agreement | null> {
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
      if (result.affected === 0) throw new NotFoundException('entity of agreement NOT_FOUND')
    } catch (err) {
      if (err.code === '23503') {
        throw new BadRequestException('entity of agreement HAS_CHILDS')
      }
      this.logger.error(`Error while deleting agreement entity \n ${err}`)
      throw err
    }

    return { message: 'SUCCESS' }
  }
}
