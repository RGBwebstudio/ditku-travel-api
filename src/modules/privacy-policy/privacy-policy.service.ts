import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { Repository } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { CreatePrivacyPolicyDto } from './dto/create-privacy-policy.dto'
import { UpdatePrivacyPolicyDto } from './dto/update-privacy-policy.dto'
import { PrivacyPolicy } from './entities/privacy-policy.entity'

@Injectable()
export class PrivacyPolicyService {
  private readonly logger = new Logger(PrivacyPolicyService.name)

  constructor(
    @InjectRepository(PrivacyPolicy)
    private readonly repo: Repository<PrivacyPolicy>
  ) {}

  async create(dto: CreatePrivacyPolicyDto): Promise<PrivacyPolicy> {
    if (typeof dto.structure === 'string') {
      dto.structure = JSON.parse(dto.structure)
    }

    const entity = this.repo.create(dto)
    try {
      return await this.repo.save(entity)
    } catch (error) {
      this.logger.error(`Error creating privacy policy: ${error.message}`)
      throw new BadRequestException('entity of privacy-policy NOT_CREATED')
    }
  }

  async findAll(take: number, skip: number): Promise<{ entities: PrivacyPolicy[]; count: number }> {
    const entities = await this.repo.find({
      take,
      skip,
      order: { created_at: 'DESC' },
    })
    const count = await this.repo.count()
    return { entities, count }
  }

  async findOne(lang: LANG): Promise<PrivacyPolicy> {
    const entity = await this.repo.findOne({ where: { lang } })
    if (!entity) {
      return this.repo.save(this.repo.create({ lang, structure: {} }))
    }
    return entity
  }

  async update(dto: UpdatePrivacyPolicyDto): Promise<PrivacyPolicy | null> {
    const { lang } = dto

    const updateData: QueryDeepPartialEntity<PrivacyPolicy> = {}
    if (dto.structure) {
      if (typeof dto.structure === 'string') {
        updateData.structure = JSON.parse(dto.structure)
      } else {
        updateData.structure = dto.structure
      }
    }

    const result = await this.repo.update({ lang }, updateData)

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
      if (result.affected === 0) throw new NotFoundException('entity of privacy-policy NOT_FOUND')
    } catch (err) {
      if (err.code === '23503') {
        throw new BadRequestException('entity of privacy-policy HAS_CHILDS')
      }
      this.logger.error(`Error while deleting privacy policy entity \n ${err}`)
      throw err
    }

    return { message: 'SUCCESS' }
  }
}
