import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { LANG } from 'src/common/enums/translation.enum'
import { Repository } from 'typeorm'

import { CreateGlobalSettingsDto } from './dto/create-global-settings.dto'
import { UpdateGlobalSettingsDto } from './dto/update-global-settings.dto'
import { GlobalSettings } from './entities/global-settings.entity'

@Injectable()
export class GlobalSettingsService {
  constructor(
    @InjectRepository(GlobalSettings)
    private repo: Repository<GlobalSettings>
  ) {}

  async create(dto: CreateGlobalSettingsDto) {
    return await this.repo.save(dto)
  }

  async findAll() {
    return await this.repo.find()
  }

  async findOne(lang: LANG = LANG.UA) {
    const settings = await this.repo.findOne({ where: { lang } })
    if (settings) return settings

    // If not found for specific lang, try to find any to return structure, or return empty
    const [anySettings] = await this.repo.find({ order: { id: 'ASC' }, take: 1 })
    return anySettings || {}
  }

  async update(id: number, dto: UpdateGlobalSettingsDto) {
    const setting = await this.repo.findOneBy({ id })
    if (!setting) throw new NotFoundException('Settings not found')

    return await this.repo.save({ ...setting, ...dto })
  }
}
