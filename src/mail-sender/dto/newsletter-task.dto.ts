import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber } from 'class-validator'

export class PrepareNewsletterDto {
  @ApiProperty({ example: ['user_1@mail.com', 'user_2@mail.com'] })
  @IsArray()
  emails: string[]

  @ApiProperty({ example: 'default' })
  @IsNumber()
  template_id: number
}
