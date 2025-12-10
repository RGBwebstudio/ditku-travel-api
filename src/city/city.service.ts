import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { City } from './entities/city.entity'
import { CreateCityDto } from './dto/create-city.dto'
import { UpdateCityDto } from './dto/update-city.dto'
import { Country } from 'src/country/entities/country.entity'

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly repo: Repository<City>
  ) {}

  async create(dto: CreateCityDto): Promise<City> {
    const payload: Partial<City> = {
      is_hidden: dto.is_hidden,
      title: dto.title,
      url: dto.url,
      seo_title: dto.seo_title,
      seo_description: dto.seo_description,
      order: dto.order
    }

    if (typeof dto.country_id !== 'undefined') {
      payload.country_id = { id: dto.country_id } as Country
    }

    const entity = this.repo.create(payload)

    try {
      const saved = await this.repo.save(entity)
      return saved
    } catch {
      throw new BadRequestException('city is NOT_CREATED')
    }
  }

  async findAll(take = 20, skip = 0) {
    const [entities, count] = await this.repo.findAndCount({
      take,
      skip,
      order: { order: 'ASC' },
      relations: ['country_id']
    })

    return { entities, count }
  }

  async findByCountry(countryId: number) {
    const entities = await this.repo.find({
      where: { country_id: { id: countryId } as Country },
      order: { order: 'ASC' },
      relations: ['country_id']
    })

    return entities
  }

  async getAllList() {
    const entities = await this.repo.find({
      order: { order: 'ASC' },
      relations: ['country_id']
    })

    return { entities }
  }

  async findOne(id: number): Promise<City> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['country_id']
    })
    if (!entity) throw new NotFoundException('city is NOT_FOUND')
    return entity
  }

  async update(id: number, dto: UpdateCityDto): Promise<City> {
    const entity = await this.repo.findOne({ where: { id } })
    if (!entity) throw new NotFoundException('city is NOT_FOUND')

    try {
      const payload = {
        ...entity,
        ...dto,
        country_id: dto.country_id
          ? ({ id: dto.country_id } as Country)
          : entity.country_id
      }
      const saved = await this.repo.save(payload)
      return saved as City
    } catch {
      throw new BadRequestException('city is NOT_UPDATED')
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    const result = await this.repo.delete(id)
    if (result.affected === 0) throw new NotFoundException('city is NOT_FOUND')
    return { message: 'SUCCESS' }
  }
}
