import { ApiProperty } from '@nestjs/swagger'

import { IsString } from 'class-validator'

export class CreateMailLayoutDto {
  @ApiProperty({ example: 'Назва шаблону' })
  @IsString()
  title: string

  @ApiProperty({ example: 'Тема листа' })
  @IsString()
  subject: string

  @ApiProperty({ example: "{'message': 'message'}" })
  @IsString()
  content: string
}
