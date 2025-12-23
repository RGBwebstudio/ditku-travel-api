import { ApiProperty } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator'

export class ProductDeleteImagesDto {
  @ApiProperty({ type: [Number], description: 'Array of image ids to delete' })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  ids: number[]
}
