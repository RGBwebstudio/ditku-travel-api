import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FormatGroupCreateDto {
  @ApiProperty({ example: '8-10' })
  @IsString()
  title: string

  @ApiProperty({ example: '8-10' })
  @IsString()
  value: string
}
