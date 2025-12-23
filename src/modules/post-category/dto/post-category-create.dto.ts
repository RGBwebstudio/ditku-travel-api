import { ApiProperty } from '@nestjs/swagger'

import { IsString } from 'class-validator'

export class PostCategoryCreateDto {
  @ApiProperty({ example: 'Новини' })
  @IsString()
  title: string
}
