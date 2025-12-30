import { ApiProperty } from '@nestjs/swagger'

import { IsString } from 'class-validator'

export class CreateVideoCategoryDto {
  @ApiProperty({ example: 'Тури Україною' })
  @IsString()
  title: string
}
