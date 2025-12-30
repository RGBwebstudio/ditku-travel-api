import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { AuthAdminGuard } from 'src/core/auth/auth-admin.guard'

import { SendEmailDto } from './dto/send-email.dto'
import { MailSenderService } from './mail-sender.service'

@ApiTags('Відправка листів')
@Controller('mail-sender')
export class MailSenderController {
  constructor(private mailSenderService: MailSenderService) {}

  @UseGuards(AuthAdminGuard)
  @Post('send')
  @ApiOperation({ summary: 'Відправка листа' })
  sendMail(@Body() dto: SendEmailDto) {
    this.mailSenderService.sendMail(dto)
  }
}
