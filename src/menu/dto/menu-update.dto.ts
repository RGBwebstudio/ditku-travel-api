import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsArray, IsOptional, IsPositive } from 'class-validator'
import { Type } from 'class-transformer'

export class MenuUpdateDto {
  @ApiProperty({ description: 'Category id', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'category_id must be a number' })
  @IsPositive({ message: 'category_id must be positive' })
  category_id?: number

  @ApiProperty({
    description: 'Seo filter ids',
    required: false,
    type: [Number]
  })
  @IsOptional()
  @IsArray({ message: 'seo_filter_ids must be an array of numbers' })
  @Type(() => Number)
  seo_filter_ids?: number[]

  @ApiProperty({ description: 'Order in list', required: false })
  @IsOptional()
  @IsInt()
  order_in_list?: number
}
