import { Module } from '@nestjs/common'
import { MailSenderController } from './mail-sender.controller'
import { MailSenderService } from './mail-sender.service'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import * as path from 'path'
import { MailLayoutModule } from 'src/mail-layout/mail-layout.module'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          port: configService.get('MAIL_PORT'),
          secure: configService.get('MAIL_SECURE'),
          auth: {
            user: configService.get('MAIL_LOGIN'),
            pass: configService.get('MAIL_PASSWORD')
          }
        },
        defaults: {
          from: configService.get('MAIL_FROM')
        },
        template: {
          dir: path.join(__dirname + '/templates'),
          adapter: new HandlebarsAdapter(),
          options: { strict: true }
        }
      })
    }),

    MailLayoutModule
  ],
  providers: [MailSenderService],
  controllers: [MailSenderController],
  exports: [MailSenderService]
})
export class MailSenderModule {}
