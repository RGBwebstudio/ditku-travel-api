import { IsBoolean, IsString, IsInt, Min, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PostCategory } from 'src/post-category/entities/post-category.entity'

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
}
