import { ApiProperty } from '@nestjs/swagger'
import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator'
import { Type } from 'class-transformer'

export class ProductDeleteImagesDto {
  @ApiProperty({ type: [Number], description: 'Array of image ids to delete' })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  ids: number[]
}
