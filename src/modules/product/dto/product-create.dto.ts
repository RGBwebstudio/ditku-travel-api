import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsBoolean, IsString, IsInt, Min, IsOptional, IsPositive, IsArray } from 'class-validator'
import { Category } from 'src/modules/category/entities/category.entity'
import { Parameter } from 'src/modules/parameter/entities/parameter.entity'

import { Product } from '../entities/product.entity'

export class ProductCreateDto {
  @ApiProperty({ example: false, description: 'Show product on main page' })
  @IsBoolean()
  show_on_main_page: boolean

  @ApiProperty({ example: false })
  @IsBoolean()
  is_top: boolean

  @ApiProperty({ example: false, default: false })
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

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  is_parent: boolean

  @ApiProperty({ example: 'Тур' })
  @IsString()
  title: string

  @ApiProperty({ example: 'Тур до карпат для дітей' })
  @IsString()
  subtitle: string

  @ApiProperty({ example: 'сео-заголовок' })
  @IsString()
  seo_title: string

  @ApiProperty({ example: 'сео-текст' })
  @IsString()
  seo_description: string

  @ApiProperty({ example: 'tour' })
  @IsString()
  url: string

  @ApiPropertyOptional({ example: '0.00', description: 'Ціна' })
  @IsOptional()
  @IsString()
  price?: string

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

  @ApiPropertyOptional({
    type: [Number],
    description: 'Array of Format group ids',
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  format_group?: number[]

  @ApiPropertyOptional({
    example: 'історію, культуру, побут, архітектуру',
    description: 'Навички (через кому)',
  })
  @IsOptional()
  @IsString()
  skills?: string

  @ApiPropertyOptional({
    example: 'критичне мислення, пізнання світу, емоційний досвід',
    description: 'Досліджуємо (через кому)',
  })
  @IsOptional()
  @IsString()
  discover?: string

  @ApiPropertyOptional({
    description: 'Структура контенту блоків',
  })
  @IsOptional()
  @IsString()
  structure?: Record<string, string>

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  sections?: number[]

  @ApiPropertyOptional({ example: '2023-12-01T00:00:00Z' })
  @IsOptional()
  start_at: Date

  @ApiPropertyOptional({ example: '2023-12-31T23:59:59Z' })
  @IsOptional()
  end_at: Date
}
