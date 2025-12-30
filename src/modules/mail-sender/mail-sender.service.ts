import { Injectable } from '@nestjs/common'

import { MailerService } from '@nestjs-modules/mailer'
import { SentMessageInfo } from 'nodemailer'
import { MailLayoutService } from 'src/modules/mail-layout/mail-layout.service'

import { SendEmailDto } from './dto/send-email.dto'

@Injectable()
export class MailSenderService {
  constructor(
    private mailLayoutService: MailLayoutService,
    private mailerService: MailerService
  ) {}

  async sendMail(dto: SendEmailDto): SentMessageInfo {
    const { to, subject, template, context } = dto

    try {
      const result: SentMessageInfo = await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      })

      return result
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error to send mail to user with e-mail ${to} \n ${err.message}`)
        return err
      } else {
        console.error(`Error to send mail to user with e-mail ${to} \n ${JSON.stringify(err)}`)
        return new Error('Unknown error occurred')
      }
    }
  }
}
