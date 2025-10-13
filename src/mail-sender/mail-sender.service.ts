import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { SendEmailDto } from './dto/send-email.dto'
import { PrepareNewsletterDto } from './dto/newsletter-task.dto'
import { MailLayoutService } from 'src/mail-layout/mail-layout.service'
import { UserService } from 'src/user/user.service'
import { MailerService } from '@nestjs-modules/mailer'
import { MailLayout } from 'src/mail-layout/entities/mail-layout.entity'
import { SentMessageInfo } from 'nodemailer'

@Injectable()
export class MailSenderService {
  constructor(
    private mailLayoutService: MailLayoutService,
    private mailerService: MailerService,
    @Inject(forwardRef(() => UserService)) private userService: UserService
  ) {}

  async sendMail(dto: SendEmailDto): SentMessageInfo {
    const { to, subject, template, context } = dto

    try {
      const result: SentMessageInfo = await this.mailerService.sendMail({
        to,
        subject,
        template,
        context
      })

      return result
    } catch (err) {
      if (err instanceof Error) {
        console.error(
          `Error to send mail to user with e-mail ${to} \n ${err.message}`
        )
        return err
      } else {
        console.error(
          `Error to send mail to user with e-mail ${to} \n ${JSON.stringify(err)}`
        )
        return new Error('Unknown error occurred')
      }
    }
  }

  async sendNewsletter(dto: PrepareNewsletterDto) {
    const { emails, template_id } = dto

    let mailTemplate: MailLayout | null = null

    if (!mailTemplate) {
      throw new NotFoundException(`Template with id ${template_id} not found`)
    }

    try {
      mailTemplate = await this.mailLayoutService.findOne(template_id)
    } catch {
      throw new NotFoundException(`Template with id ${template_id} not found`)
    }

    const users = await this.userService.findByEmails(emails)

    if (users.length === 0) throw new NotFoundException('Users not found')

    const preparedData = users.map((user) => ({
      to: user.email,
      subject: mailTemplate.subject,
      template: 'default',
      context: {
        message: mailTemplate.content.replace(
          '%name%',
          `${user.first_name} ${user.second_name}`
        )
      }
    }))

    await Promise.all(
      preparedData.map(async (mailData) => {
        const result = await this.sendMail(mailData)

        if (result instanceof Error) {
          console.error(
            `Failed to send mail to ${mailData.to}: ${result.message}`
          )
        }
      })
    )

    return 'Process started...'
  }
}
