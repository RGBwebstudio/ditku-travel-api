import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsBoolean, IsString, IsInt, Min, IsOptional, IsPositive, IsArray, ValidateNested } from 'class-validator'
import { Category } from 'src/modules/category/entities/category.entity'
import { Parameter } from 'src/modules/parameter/entities/parameter.entity'

import { Product } from '../entities/product.entity'

export class SafeCarouselSlideDto {
  @IsString()
  id: string

  @IsString()
  image: string

  @IsString()
  title_ua: string

  @IsString()
  title_en: string

  @IsString()
  text_ua: string

  @IsString()
  text_en: string
}

export class SafeCarouselSectionDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SafeCarouselSlideDto)
  slides?: SafeCarouselSlideDto[]

  @IsOptional()
  @IsString()
  title_part_1_ua?: string

  @IsOptional()
  @IsString()
  title_part_1_en?: string

  @IsOptional()
  @IsString()
  title_highlight_ua?: string

  @IsOptional()
  @IsString()
  title_highlight_en?: string

  @IsOptional()
  @IsString()
  title_part_2_ua?: string

  @IsOptional()
  @IsString()
  title_part_2_en?: string

  @IsOptional()
  @IsString()
  title_suffix_ua?: string

  @IsOptional()
  @IsString()
  title_suffix_en?: string
}

export class ProductCreateDto {
  @ApiProperty({ example: false, description: 'Show product on main page' })
  @IsBoolean()
  show_on_main_page: boolean

  @ApiProperty({ example: false, description: 'Show product in popular block on main page' })
  @IsBoolean()
  @IsOptional()
  show_in_popular_on_main_page: boolean

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

  @ApiPropertyOptional({ description: 'Array of structured skills' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillItemDto)
  skills_list?: SkillItemDto[]

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
  structure?: any

  @ApiPropertyOptional({
    description: 'Structure for Why Travel section',
  })
  @IsOptional()
  why_travel_section?: any

  @ApiPropertyOptional({
    description: 'Photo report data',
  })
  @IsOptional()
  photo_report?: any

  @ApiPropertyOptional({
    description: 'Safe carousel data',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SafeCarouselSectionDto)
  safe_carousel?: SafeCarouselSectionDto

  @ApiPropertyOptional({ description: 'Global section IDs (numbers) OR product section objects' })
  @IsOptional()
  @IsArray()
  sections?: (number | ProductSectionDto)[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  productSections?: any[]

  @ApiPropertyOptional({ example: '6-17 років' })
  @IsOptional()
  @IsString()
  age?: string

  @ApiPropertyOptional({
    description: 'Structure for What we learn',
  })
  @IsOptional()
  learning?: any

  @ApiPropertyOptional()
  @IsOptional()
  learning_ua?: any

  @ApiPropertyOptional()
  @IsOptional()
  learning_en?: any

  @ApiPropertyOptional({
    description: 'Detailed itinerary array',
  })
  @IsOptional()
  program?: any

  @ApiPropertyOptional({ description: 'Array of inclusive items' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InclusiveItemDto)
  inclusive?: InclusiveItemDto[]

  @ApiPropertyOptional({ description: 'Array of not included items' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotIncludedItemDto)
  notIncludes?: NotIncludedItemDto[]

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

  @ApiPropertyOptional({ type: [Number], description: 'Array of FAQ IDs' })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  faq_ids?: number[]

  @ApiPropertyOptional({ type: [Number], description: 'Array of Recommended Product IDs' })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  recommended_ids?: number[]

  @ApiPropertyOptional({ type: [Number], description: 'Array of Blog (Post) IDs' })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  blog_ids?: number[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  faq_header_pink_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  faq_header_pink_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  faq_header_black_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  faq_header_black_en?: string

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

  @ApiPropertyOptional({ description: 'Legacy banners array' })
  @IsOptional()
  @IsArray()
  banners?: any[]
}

export class ProductSectionDto {
  @IsOptional()
  @IsInt()
  id?: number

  @IsString()
  @IsOptional()
  type?: string // 'content' | 'banners' | 'quote'

  @IsInt()
  @IsOptional()
  order?: number

  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images?: string[]

  // Badge fields
  @IsString()
  @IsOptional()
  badge_ua?: string

  @IsString()
  @IsOptional()
  badge_en?: string

  // Localized fields
  @IsString()
  @IsOptional()
  title_ua?: string

  @IsString()
  @IsOptional()
  title_en?: string

  @IsString()
  @IsOptional()
  description_ua?: string

  @IsString()
  @IsOptional()
  description_en?: string

  // Banner 1 fields
  @IsString()
  @IsOptional()
  banner1_title_ua?: string

  @IsString()
  @IsOptional()
  banner1_title_en?: string

  @IsString()
  @IsOptional()
  banner1_button_text_ua?: string

  @IsString()
  @IsOptional()
  banner1_button_text_en?: string

  @IsString()
  @IsOptional()
  banner1_link_ua?: string

  @IsString()
  @IsOptional()
  banner1_link_en?: string

  // Banner 2 fields
  @IsString()
  @IsOptional()
  banner2_title_ua?: string

  @IsString()
  @IsOptional()
  banner2_title_en?: string

  @IsString()
  @IsOptional()
  banner2_button_text_ua?: string

  @IsString()
  @IsOptional()
  banner2_button_text_en?: string

  @IsString()
  @IsOptional()
  banner2_link_ua?: string

  @IsString()
  @IsOptional()
  banner2_link_en?: string
}

export class SkillItemDto {
  @IsOptional()
  @IsString()
  id?: string

  @IsOptional()
  @IsString()
  image?: string

  @IsOptional()
  @IsString()
  decor?: string

  @IsOptional()
  @IsString()
  bg_color?: string

  @IsOptional()
  @IsBoolean()
  is_full_card?: boolean

  @IsOptional()
  @IsString()
  title_ua?: string

  @IsOptional()
  @IsString()
  title_en?: string

  @IsOptional()
  @IsString()
  text_ua?: string

  @IsOptional()
  @IsString()
  text_en?: string
}

export class InclusiveItemDto {
  @IsOptional()
  @IsString()
  id?: string

  @IsOptional()
  @IsString()
  icon?: string

  @IsOptional()
  @IsString()
  bg_color?: string

  @IsOptional()
  @IsString()
  text_ua?: string

  @IsOptional()
  @IsString()
  text_en?: string
}

export class NotIncludedItemDto {
  @IsOptional()
  @IsString()
  id?: string

  @IsOptional()
  @IsString()
  text_ua?: string

  @IsOptional()
  @IsString()
  text_en?: string
}
