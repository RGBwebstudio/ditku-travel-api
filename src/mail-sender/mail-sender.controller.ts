import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { MailSenderService } from './mail-sender.service'
import { SendEmailDto } from './dto/send-email.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthAdminGuard } from 'src/auth/auth-admin.guard'

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
