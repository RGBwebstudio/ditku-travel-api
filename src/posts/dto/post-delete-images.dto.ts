import { IsArray, IsInt } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class PostDeleteImagesDto {
  @ApiProperty({ example: [1, 2, 3] })
  @IsArray()
  @IsInt({ each: true })
  imageIds: number[]
}
