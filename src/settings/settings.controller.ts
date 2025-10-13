import { Controller, Get, Patch, Body } from '@nestjs/common'
import { SettingsService } from './settings.service'
import { UpdateMinimalOrderPriceDto } from './dto/update-minimal-order-price.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Налаштування')
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('minimal-order-price')
  @ApiOperation({ summary: 'Отримати мінімальну суму замовлення' })
  getMinimalOrderPrice() {
    return this.settingsService.getMinimalOrderPrice()
  }

  @Patch('minimal-order-price')
  @ApiOperation({ summary: 'Оновити мінімальну суму замовлення' })
  updateMinimalOrderPrice(@Body() dto: UpdateMinimalOrderPriceDto) {
    return this.settingsService.updateMinimalOrderPrice(dto.price)
  }
}
