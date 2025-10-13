import {
  IsBoolean,
  IsString,
  IsInt,
  Min,
  IsOptional,
  IsPositive,
  IsArray
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Parameter } from 'src/parameter/entities/parameter.entity'
import { Product } from '../entities/product.entity'
import { Category } from 'src/category/entities/category.entity'
import { ProductPromotion } from 'src/product-promotion/entities/product-promotion.entity'
import { Measurement } from 'src/measurement/entities/measurement.entity'

export class ProductCreateDto {
  @ApiPropertyOptional({ example: '123' })
  @IsString()
  @IsOptional()
  custom_id: string

  @ApiProperty({ example: false, description: 'Show product on main page' })
  @IsBoolean()
  show_on_main_page: boolean

  @ApiProperty({ example: false })
  @IsBoolean()
  is_top_product: boolean

  @ApiProperty({ example: false })
  @IsBoolean()
  is_hidden: boolean

  @ApiProperty({ example: null })
  @IsInt()
  @IsPositive()
  @IsOptional()
  parent_id: Product

  @ApiProperty({ example: 1 })
  @IsInt()
  category_id: Category

  @ApiProperty({ example: 1 })
  @IsInt()
  measurement_id: Measurement

  @ApiProperty({ example: null })
  @IsInt()
  @IsOptional()
  promotion_id: ProductPromotion

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  is_parent: boolean

  @ApiProperty({ example: '123' })
  @IsString()
  article: string

  @ApiProperty({ example: 'Яблуко Fuji' })
  @IsString()
  title: string

  @ApiProperty({ example: 'сео-заголовок' })
  @IsString()
  seo_title: string

  @ApiProperty({ example: 'сео-текст' })
  @IsString()
  seo_description: string

  @ApiProperty({ example: 'yablyko-fuji' })
  @IsString()
  url: string

  @ApiProperty({ example: '0.00' })
  @IsString()
  price: string

  @ApiProperty({ example: '0.00' })
  @IsString()
  price_retail: string

  @ApiProperty({ example: 'Опис продукту' })
  @IsString()
  description_1: string

  @ApiProperty({ example: 'Склад продукту' })
  @IsString()
  description_2: string

  @ApiProperty({ example: 'Загальна інформація (JSON рядок)' })
  @IsString()
  description_3: string

  @ApiProperty({ example: 'Харчова цінність (JSON рядок)' })
  @IsString()
  description_4: string

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  order_in_list: number

  @ApiPropertyOptional({ example: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  popular_count: number

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  is_popular: boolean

  @IsArray()
  @IsOptional()
  parameters: Parameter[]

  @ApiPropertyOptional({ example: '1.234', description: 'Product weight' })
  @IsString()
  @IsOptional()
  weight: string
}
