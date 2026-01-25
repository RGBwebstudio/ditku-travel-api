import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsOptional, IsString, IsInt, IsArray } from 'class-validator'

export class PostCategoryCreateDto {
  @ApiProperty({ example: 'Новини' })
  @IsString()
  title: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  top_post_id?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  side_post_ids?: number[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  recommended_post_ids?: number[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string
}
