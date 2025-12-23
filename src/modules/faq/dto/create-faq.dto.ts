import { ApiProperty } from '@nestjs/swagger'

import { IsString } from 'class-validator'

export class CreateFaqDto {
  @ApiProperty({
    example: 'Чому я не сокіл, чому не літаю, Чому мені, боже, ти криллів не дав?',
  })
  @IsString()
  title: string

  @ApiProperty({ example: 'Я б землю покинув і в небо злітав!' })
  @IsString()
  text: string
}
