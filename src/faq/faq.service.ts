import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateFaqDto } from './dto/create-faq.dto'
import { UpdateFaqDto } from './dto/update-faq.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Faq } from './entities/faq.entity'
import { Repository } from 'typeorm'
import { FaqCreateTranslateDto } from './dto/faq-create-translate.dto'
import { FaqTranslate } from './entities/faq-translate.entity'
import { FaqUpdateTranslateDto } from './dto/faq-update-translate.dto'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { LANG } from 'src/common/enums/translation.enum'

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq) private faqRepo: Repository<Faq>,
    @InjectRepository(FaqTranslate)
    private entityTranslateRepo: Repository<FaqTranslate>
  ) {}

  async findAll(take: number, skip: number, lang: LANG) {
    const entities = await this.faqRepo.find({
      take,
      skip,
      order: { created_at: 'DESC' },
      relations: ['translates']
    })

    const mappedEntities = applyTranslations(entities, lang)
    const count = await this.faqRepo.count()

    return { entities: mappedEntities, count }
  }

  async findOne(id: number, lang: LANG) {
    const result = await this.faqRepo.findOne({
      where: { id },
      relations: ['translates']
    })
    if (!result) throw new NotFoundException('faq entity is NOT_FOUND')

    const mappedEntities = applyTranslations([result], lang)
    return mappedEntities[0]
  }

  async create(dto: CreateFaqDto) {
    // Ensure unique title
    const exists = await this.faqRepo
      .createQueryBuilder('faq')
      .where('LOWER(faq.title) = :title', {
        title: (dto.title || '').toLowerCase()
      })
      .getOne()

    if (exists) throw new BadRequestException('NAME_ALREADY_RESERVED')

    const newPage = this.faqRepo.create(dto)
    try {
      const savedPage = await this.faqRepo.save(newPage)
      return savedPage
    } catch (error) {
      console.error('Error creating FAQ:', error)
      throw new BadRequestException('faq entity is NOT_CREATED')
    }
  }

  async update(id: number, dto: UpdateFaqDto) {
    if (dto.title) {
      const exists = await this.faqRepo
        .createQueryBuilder('faq')
        .where('LOWER(faq.title) = :title', { title: dto.title.toLowerCase() })
        .andWhere('faq.id != :id', { id })
        .getOne()

      if (exists) throw new BadRequestException('NAME_ALREADY_RESERVED')
    }

    await this.faqRepo.update({ id }, dto)

    const page = await this.faqRepo.findOne({ where: { id } })
    if (!page) throw new NotFoundException('faq entity is NOT_FOUND')

    return page
  }

  async delete(id: number): Promise<{ message: string }> {
    const result = await this.faqRepo.delete({ id })

    if (result.affected === 0) {
      throw new NotFoundException('faq entity is NOT_FOUND')
    }

    return { message: 'SUCCESS' }
  }

  async createTranslates(
    dto: FaqCreateTranslateDto[]
  ): Promise<FaqTranslate[] | null> {
    if (dto?.length) {
      const results: FaqTranslate[] = []

      for (const translate of dto) {
        const data = this.entityTranslateRepo.create(translate)
        const result = await this.entityTranslateRepo.save(data)
        results.push(result)
      }

      return results
    }
    return null
  }

  async updateTranslates(
    dto: FaqUpdateTranslateDto[]
  ): Promise<FaqTranslate[] | null> {
    const results: FaqTranslate[] = []

    for (const translate of dto) {
      const result = await this.entityTranslateRepo.update(translate.id, {
        ...translate
      })

      if (result.affected === 0)
        throw new NotFoundException('faq entity is NOT_FOUND')

      const updatedEntityTranslate = await this.entityTranslateRepo.findOne({
        where: { id: translate.id }
      })

      if (updatedEntityTranslate) results.push(updatedEntityTranslate)
    }

    return results
  }

  async deleteTranslate(
    id: number
  ): Promise<{ message: string } | NotFoundException> {
    const result = await this.entityTranslateRepo.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException('faq entity is NOT_FOUND')
    }

    return { message: 'OK' }
  }
}
