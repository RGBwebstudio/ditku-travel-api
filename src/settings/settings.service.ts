import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Setting } from './entities/setting.entity'

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name)

  constructor(
    @InjectRepository(Setting)
    private settingRepo: Repository<Setting>
  ) {}

  async getMinimalOrderPrice(): Promise<{ price: number }> {
    const setting = await this.settingRepo.findOne({
      where: { key: 'minimal_order_price' }
    })

    return {
      price: setting ? parseFloat(setting.value) : 0
    }
  }

  async updateMinimalOrderPrice(price: number): Promise<{ price: number }> {
    const setting = await this.settingRepo.findOne({
      where: { key: 'minimal_order_price' }
    })

    if (setting) {
      setting.value = price.toString()
      await this.settingRepo.save(setting)
    } else {
      const newSetting = this.settingRepo.create({
        key: 'minimal_order_price',
        value: price.toString()
      })
      await this.settingRepo.save(newSetting)
    }

    this.logger.log(`Minimal order price updated to ${price}`)

    return { price }
  }
}
