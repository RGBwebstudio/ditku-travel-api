import { ApiProperty } from '@nestjs/swagger'
import { IsObject, IsString } from 'class-validator'

interface MessageBody {
  sender: string
  text: string
}

export class SMSSender {
  @ApiProperty({ example: ['+3805552211'] })
  @IsString({ each: true })
  recipients: string[]

  @ApiProperty({ example: { sender: 'MARKA', text: 'sms message' } })
  @IsObject()
  message_data: MessageBody
}
