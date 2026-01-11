import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsBoolean, IsString, IsInt, Min, IsOptional, ValidateNested, IsArray } from 'class-validator'
import { PostCategory } from 'src/modules/post-category/entities/post-category.entity'

import { CreatePostSectionDto } from './create-post-section.dto'
import { CreatePostSocialDto } from './create-post-social.dto'

export class PostCreateDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  is_hidden: boolean

  @ApiProperty({ example: false })
  @IsBoolean()
  is_top_main: boolean

  @ApiProperty({ example: false })
  @IsBoolean()
  is_top_side: boolean

  @ApiPropertyOptional({ example: 'Новинка' })
  @IsString()
  @IsOptional()
  badge_text: string

  @ApiProperty({ example: 'Заголовок посту' })
  @IsString()
  title: string

  @ApiProperty({ example: 'zagolovok-postu' })
  @IsString()
  url: string

  @ApiPropertyOptional({ example: 'Сео-заголовок' })
  @IsString()
  @IsOptional()
  seo_title: string

  @ApiPropertyOptional({ example: 'Сео-опис' })
  @IsString()
  @IsOptional()
  seo_description: string

  @ApiPropertyOptional({ example: '<p>Контент посту</p>' })
  @IsString()
  @IsOptional()
  content: string

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  order_in_category: number

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  order_in_product: number

  @ApiProperty({ example: 1 })
  @IsInt()
  category_id: PostCategory

  @ApiPropertyOptional({ type: [CreatePostSectionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostSectionDto)
  sections?: CreatePostSectionDto[]

  @ApiPropertyOptional({ type: [CreatePostSocialDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostSocialDto)
  socials?: CreatePostSocialDto[]

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
  content_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content_en?: string
}
