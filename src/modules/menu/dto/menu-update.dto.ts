import { ApiProperty } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsInt, IsArray, IsOptional, IsPositive, IsEnum } from 'class-validator'

import { MenuType } from '../entities/menu.entity'

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
    type: [Number],
  })
  @IsOptional()
  @IsArray({ message: 'seo_filter_ids must be an array of numbers' })
  @Type(() => Number)
  seo_filter_ids?: number[]

  @ApiProperty({ description: 'Order in list', required: false })
  @IsOptional()
  @IsInt()
  order_in_list?: number

  @ApiProperty({ enum: MenuType, required: false })
  @IsOptional()
  @IsEnum(MenuType)
  type?: MenuType

  @ApiProperty({ description: 'Page constructor category id', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page_constructor_category_id?: number

  @ApiProperty({
    description: 'Page constructor ids',
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  page_constructor_ids?: number[]
}
