import { ApiProperty } from '@nestjs/swagger'

import { IsObject, IsString } from 'class-validator'

export class SendEmailDto {
  @ApiProperty({ example: 'user@mail.com' })
  @IsString()
  to: string

  @ApiProperty({ example: 'Тема листа' })
  @IsString()
  subject: string

  @ApiProperty({ example: 'default' })
  @IsString()
  template: string

  @ApiProperty({ example: { message: 'message' } })
  @IsObject()
  context: object
}
