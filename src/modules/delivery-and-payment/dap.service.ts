import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { Repository } from 'typeorm'

import { CreateDAPDto } from './dto/create-dap.dto'
import { DAPCreateTranslateDto } from './dto/dap-create-translate.dto'
import { DAPUpdateTranslateDto } from './dto/dap-update-translate.dto'
import { UpdateDAPDto } from './dto/update-dap.dto'
import { DAPTranslates } from './entities/dap-translate.entity'
import { DAP } from './entities/dap.entity'

@Injectable()
export class DAPService {
  constructor(
    @InjectRepository(DAP) private dpaRepo: Repository<DAP>,
    @InjectRepository(DAPTranslates)
    private entityTranslateRepo: Repository<DAPTranslates>
  ) {}

  async findAll(take: number, skip: number, lang: LANG) {
    const entities = await this.dpaRepo.find({
      take,
      skip,
      order: { created_at: 'DESC' },
      relations: ['translates'],
    })

    const mappedEntities = applyTranslations(entities, lang)
    const count = await this.dpaRepo.count()

    return { entities: mappedEntities, count }
  }

  async findOne(id: number, lang: LANG) {
    const result = await this.dpaRepo.findOne({
      where: { id },
      relations: ['translates'],
    })
    if (!result) throw new NotFoundException('delivery and payment entity is NOT_FOUND')

    const mappedEntities = applyTranslations([result], lang)
    return mappedEntities[0]
  }

  async create(dto: CreateDAPDto) {
    const newPage = this.dpaRepo.create(dto)
    try {
      const savedPage = await this.dpaRepo.save(newPage)
      return savedPage
    } catch (error) {
      console.error('Error creating FAQ:', error)
      throw new BadRequestException('NOT_CREATED')
    }
  }

  async update(id: number, dto: UpdateDAPDto) {
    await this.dpaRepo.update({ id }, dto)

    const page = await this.dpaRepo.findOne({ where: { id } })
    if (!page) throw new NotFoundException('delivery and payment entity is NOT_FOUND')

    return page
  }

  async delete(id: number): Promise<{ message: string }> {
    const result = await this.dpaRepo.delete({ id })

    if (result.affected === 0) {
      throw new NotFoundException('delivery and payment entity is NOT_FOUND')
    }

    return { message: 'SUCCESS' }
  }

  async createTranslates(dto: DAPCreateTranslateDto[]): Promise<DAPTranslates[] | null> {
    if (dto?.length) {
      const results: DAPTranslates[] = []

      for (const translate of dto) {
        const data = this.entityTranslateRepo.create(translate)
        const result = await this.entityTranslateRepo.save(data)
        results.push(result)
      }

      return results
    }
    return null
  }

  async updateTranslates(dto: DAPUpdateTranslateDto[]): Promise<DAPTranslates[] | null> {
    const results: DAPTranslates[] = []

    for (const translate of dto) {
      const result = await this.entityTranslateRepo.update(translate.id, {
        ...translate,
      })

      if (result.affected === 0) throw new NotFoundException('delivery and payment entity translate is NOT_FOUND')

      const updatedEntityTranslate = await this.entityTranslateRepo.findOne({
        where: { id: translate.id },
      })

      if (updatedEntityTranslate) results.push(updatedEntityTranslate)
    }

    return results
  }

  async deleteTranslate(id: number): Promise<{ message: string } | NotFoundException> {
    const result = await this.entityTranslateRepo.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException('delivery and payment entity translate is NOT_FOUND')
    }

    return { message: 'OK' }
  }
}
