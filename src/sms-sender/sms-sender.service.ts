import { BadRequestException, Injectable } from '@nestjs/common'
import { SMSSender } from './dto/sms-sender.dto'
import { HttpService } from '@nestjs/axios'
import { catchError, firstValueFrom } from 'rxjs'
import { AxiosError } from 'axios'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SmsSenderService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}

  async send(dto: SMSSender) {
    const { recipients, message_data } = dto
    const apiKey = this.configService.get<string>('TURBO_SMS_API_KEY')

    if (!apiKey) {
      // Fail fast if API key is not configured
      throw new BadRequestException(
        'SMS API key (TURBO_SMS_API_KEY) is not configured'
      )
    }

    await firstValueFrom(
      this.httpService
        .post(
          'https://api.turbosms.ua/message/send.json',
          {
            recipients,
            sms: {
              ...message_data
            }
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`
            }
          }
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log('Error while sending sms: \n', error?.response?.data)
            throw new BadRequestException('error')
          })
        )
    )
  }
}
