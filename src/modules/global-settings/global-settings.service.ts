import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

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

  async findOne() {
    const [settings] = await this.repo.find({ order: { id: 'ASC' }, take: 1 })
    return settings || {}
  }

  async update(id: number, dto: UpdateGlobalSettingsDto) {
    const setting = await this.repo.findOneBy({ id })
    if (!setting) throw new NotFoundException('Settings not found')

    return await this.repo.save({ ...setting, ...dto })
  }
}
