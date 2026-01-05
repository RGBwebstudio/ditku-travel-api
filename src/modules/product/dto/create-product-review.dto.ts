import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateProductReviewDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  author?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  review?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text_en?: string

  @ApiProperty()
  @IsNumber()
  rating: number

  @ApiPropertyOptional()
  @IsOptional()
  created_at?: any

  @ApiPropertyOptional()
  @IsOptional()
  translates?: any
}
