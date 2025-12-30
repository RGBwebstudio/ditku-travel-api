import { ApiProperty } from '@nestjs/swagger'

import { IsArray, IsInt } from 'class-validator'

export class PostDeleteImagesDto {
  @ApiProperty({ example: [1, 2, 3] })
  @IsArray()
  @IsInt({ each: true })
  imageIds: number[]
}
