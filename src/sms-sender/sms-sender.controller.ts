import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { SmsSenderService } from './sms-sender.service'
import { SMSSender } from './dto/sms-sender.dto'
import { ApiTags } from '@nestjs/swagger'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

@ApiTags('SMS-розсилка')
@Controller('sms-sender')
export class SmsSenderController {
  constructor(private readonly smsSenderService: SmsSenderService) {}

  @Post()
  @UseGuards(AuthAdminGuard)
  send(@Body() dto: SMSSender) {
    return this.smsSenderService.send(dto)
  }
}
