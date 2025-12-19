import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SectionCreateDto {
  @ApiProperty({ example: 'Відділ' })
  @IsString()
  title: string
}
