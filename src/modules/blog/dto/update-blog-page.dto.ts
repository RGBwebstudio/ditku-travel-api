import { ApiProperty } from '@nestjs/swagger'

import { IsString, IsArray, IsOptional, IsNumber } from 'class-validator'

export class UpdateBlogPageDto {
  @IsString()
  @IsOptional()
  title_ua?: string

  @IsString()
  @IsOptional()
  title_en?: string

  @IsString()
  @IsOptional()
  meta_title_ua?: string

  @IsString()
  @IsOptional()
  meta_title_en?: string

  @IsString()
  @IsOptional()
  meta_description_ua?: string

  @IsString()
  @IsOptional()
  meta_description_en?: string

  @ApiProperty({ example: 1, description: 'ID головного посту', required: false })
  @IsNumber()
  @IsOptional()
  top_post_id?: number | null

  @ApiProperty({ example: [1, 2], description: 'IDs бокових постів', type: [Number], required: false })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  side_post_ids?: number[]

  @ApiProperty({ example: [1, 2], description: 'IDs рекомендованих постів', type: [Number], required: false })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  recommended_post_ids?: number[]
}
