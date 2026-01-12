import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { Repository } from 'typeorm'

import { CreateSafeWithUsDto } from './dto/create-safe-with-us.dto'
import { UpdateSafeWithUsDto } from './dto/update-safe-with-us.dto'
import { SafeWithUs } from './entities/safe-with-us.entity'

@Injectable()
export class SafeWithUsService {
  private readonly logger = new Logger(SafeWithUsService.name)

  constructor(
    @InjectRepository(SafeWithUs)
    private readonly repo: Repository<SafeWithUs>
  ) {}

  async create(dto: CreateSafeWithUsDto): Promise<SafeWithUs> {
    if (typeof dto.structure === 'string') {
      try {
        dto.structure = JSON.parse(dto.structure)
      } catch {
        // keep as is if not valid JSON string
      }
    }

    const entity = this.repo.create(dto)
    try {
      return await this.repo.save(entity)
    } catch (error) {
      this.logger.error(`Error creating safe-with-us: ${error.message}`)
      throw new BadRequestException('entity of safe-with-us NOT_CREATED')
    }
  }

  async findOne(lang: LANG): Promise<SafeWithUs> {
    const entity = await this.repo.findOne({ where: { lang } })
    if (!entity) {
      return this.repo.save(this.repo.create({ lang, structure: {} }))
    }
    return entity
  }

  async update(dto: UpdateSafeWithUsDto): Promise<SafeWithUs> {
    const { lang } = dto
    this.logger.log(`Updating SafeWithUs: ${JSON.stringify(dto)}`)

    if (dto.structure && typeof dto.structure === 'string') {
      try {
        dto.structure = JSON.parse(dto.structure)
      } catch {
        // keep as is
      }
    }

    let existing = await this.repo.findOne({ where: { lang } })

    if (!existing) {
      this.logger.log(`SafeWithUs not found for ${lang}, creating new`)
      existing = this.repo.create(dto)
    } else {
      this.logger.log(`SafeWithUs found for ${lang}, updating structure`)
      existing.structure = dto.structure
    }

    const saved = await this.repo.save(existing)
    this.logger.log(`Saved SafeWithUs: ${JSON.stringify(saved)}`)
    return saved
  }
}
