import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsBoolean, IsString, IsInt, Min, IsOptional, IsPositive, IsArray, ValidateNested } from 'class-validator'
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
  @IsString()
  structure?: Record<string, string>

  @ApiPropertyOptional({
    description: 'Structure for Why Travel section',
  })
  @IsOptional()
  why_travel_section?: any

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  sections?: number[]

  @ApiPropertyOptional({ example: '6-17 років' })
  @IsOptional()
  @IsString()
  age?: string

  @ApiPropertyOptional({
    description: 'Structure for What we learn',
  })
  @IsOptional()
  learning?: any

  @ApiPropertyOptional({
    description: 'Detailed itinerary array',
  })
  @IsOptional()
  program?: any

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  inclusive?: string[]

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  notIncludes?: string[]

  @ApiPropertyOptional({
    description: 'Advantages array',
  })
  @IsOptional()
  advantages?: any

  @ApiPropertyOptional({ example: '2023-12-01T00:00:00Z' })
  @IsOptional()
  @Type(() => Date)
  start_at: Date

  @ApiPropertyOptional({ example: '2023-12-31T23:59:59Z' })
  @IsOptional()
  @Type(() => Date)
  end_at: Date

  @ApiPropertyOptional({ example: '2023-12-01T00:00:00Z' })
  @IsOptional()
  @Type(() => Date)
  start_date?: Date

  @ApiPropertyOptional({ example: '2023-12-31T23:59:59Z' })
  @IsOptional()
  @Type(() => Date)
  end_date?: Date

  @ApiPropertyOptional({ type: [Number], description: 'Array of Seo Filter IDs' })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  seo_filters?: number[]

  @ApiPropertyOptional({ description: 'Array of blog objects' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductBlogDto)
  blogs?: ProductBlogDto[]

  // Flattened translations (optional, for convenience)
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitle_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitle_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_title_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_description_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_description_en?: string
}

export class ProductBlogDto {
  @IsOptional()
  id?: string | number

  @IsString()
  @IsOptional()
  title: string

  @IsString()
  @IsOptional()
  content: string

  @IsArray()
  @IsString({ each: true })
  images: string[]

  @IsString()
  @IsOptional()
  title_ua?: string

  @IsString()
  @IsOptional()
  title_en?: string

  @IsString()
  @IsOptional()
  content_ua?: string

  @IsString()
  @IsOptional()
  content_en?: string
}
