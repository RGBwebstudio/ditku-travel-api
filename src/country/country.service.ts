import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { CreateCountryDto } from './dto/create-country.dto'
import { UpdateCountryDto } from './dto/update-country.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Country } from './entities/country.entity'
import { LANG } from 'src/common/enums/translation.enum'
import { applyTranslations } from 'src/common/utils/apply-translates.util'
import { CountryTranslate } from './entities/country-translate.entity'
import { CountryCreateTranslateDto } from './dto/country-create-translate.dto'
import { CountryUpdateTranslateDto } from './dto/country-update-translate.dto'

@Injectable()
export class CountryService {
  private readonly logger = new Logger(CountryService.name)

  constructor(
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,
    @InjectRepository(CountryTranslate)
    private readonly entityTranslateRepo: Repository<CountryTranslate>
  ) {}

  async create(dto: CreateCountryDto): Promise<Country> {
    const { ...rest } = dto
    const country = this.countryRepo.create(rest)

    const exists = await this.countryRepo
      .createQueryBuilder('country')
      .where('LOWER(country.title) = :title', {
        title: (dto.title || '').toLowerCase()
      })
      .getOne()

    if (exists) throw new BadRequestException('NAME_ALREADY_RESERVED')

    try {
      return (await this.countryRepo.save(country)) as Country
    } catch (error) {
      this.logger.error(`Error creating country: ${error.message}`)
      throw new BadRequestException('NOT_CREATED')
    }
  }

  async findAll(
    take: number,
    skip: number,
    lang: LANG
  ): Promise<{ entities: Country[]; count: number }> {
    const entities = await this.countryRepo.find({
      take,
      skip,
      order: { created_at: 'DESC' },
      relations: ['brands', 'translates']
    })

    const mappedEntities = applyTranslations([entities], lang)
    const count = await this.countryRepo.count()

    return { entities: mappedEntities[0], count }
  }

  async getAllList(lang: LANG): Promise<{ entities: Country[] }> {
    const entities = await this.countryRepo.find({
      order: { created_at: 'DESC' },
      relations: ['brands', 'translates']
    })

    const mappedEntities = applyTranslations(entities, lang)

    return { entities: mappedEntities }
  }

  async searchByTitle(
    query: string,
    lang: LANG
  ): Promise<{ entities: Country[] }> {
    if (!query || query.trim().length === 0) return { entities: [] }

    let qb = this.countryRepo
      .createQueryBuilder('country')
      .leftJoinAndSelect('country.translates', 'translates')
      .leftJoinAndSelect('country.brands', 'brands')
      .where('LOWER(country.title) LIKE :title', {
        title: `%${query.toLowerCase()}%`
      })
      .orderBy('country.created_at', 'DESC')
      .take(20)

    let result = await qb.getMany()

    if (!result.length) {
      qb = this.countryRepo
        .createQueryBuilder('country')
        .leftJoinAndSelect('country.translates', 'translates')
        .leftJoinAndSelect('country.brands', 'brands')
        .where('LOWER(translates.value) LIKE :title', {
          title: `%${query.toLowerCase()}%`
        })
        .andWhere('translates.field = :field', { field: 'title' })
        .orderBy('country.created_at', 'DESC')
        .take(20)

      result = await qb.getMany()
    }

    const mapped = applyTranslations(result, lang)

    return { entities: mapped }
  }

  async findOne(id: number, lang: LANG): Promise<Country> {
    const entity = await this.countryRepo.findOne({
      where: { id },
      relations: ['brands', 'translates']
    })

    if (!entity) throw new NotFoundException('country is NOT_FOUND')

    const mappedEntity = applyTranslations([entity], lang)
    return mappedEntity[0] as Country
  }

  async update(id: number, dto: UpdateCountryDto): Promise<Country | null> {
    const country = await this.countryRepo.findOne({
      where: { id },
      relations: ['brands', 'translates']
    })
    if (!country) throw new NotFoundException('country is NOT_FOUND')

    const { ...restDto } = dto
    Object.assign(country, restDto)

    if (dto.title) {
      const exists = await this.countryRepo
        .createQueryBuilder('country')
        .where('LOWER(country.title) = :title', {
          title: dto.title.toLowerCase()
        })
        .andWhere('country.id != :id', { id })
        .getOne()

      if (exists) throw new BadRequestException('NAME_ALREADY_RESERVED')
    }

    await this.countryRepo.save(country)
    return country as Country
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.countryRepo.delete(id)
      if (result.affected === 0) {
        throw new NotFoundException('country is NOT_FOUND')
      }
    } catch (err) {
      if (err.code === '23503') {
        throw new BadRequestException('HAS_CHILDS')
      }

      this.logger.error(`Error while deleting country \n ${err}`)
      throw err
    }

    return { message: 'SUCCESS' }
  }

  async createTranslates(
    dto: CountryCreateTranslateDto[]
  ): Promise<CountryTranslate[] | null> {
    if (dto?.length) {
      const results: CountryTranslate[] = []

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
    dto: CountryUpdateTranslateDto[]
  ): Promise<CountryTranslate[] | null> {
    const results: CountryTranslate[] = []

    for (const translate of dto) {
      const result = await this.entityTranslateRepo.update(translate.id, {
        ...translate
      })

      if (result.affected === 0)
        throw new NotFoundException('country translate is NOT_FOUND')

      const updatedEntitiyTranslates = await this.entityTranslateRepo.findOne({
        where: { id: translate.id }
      })

      if (updatedEntitiyTranslates) results.push(updatedEntitiyTranslates)
    }

    return results
  }

  async deleteTranslate(
    id: number
  ): Promise<{ message: string } | NotFoundException> {
    const result = await this.entityTranslateRepo.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException('country translate is NOT_FOUND')
    }

    return { message: 'OK' }
  }
}
