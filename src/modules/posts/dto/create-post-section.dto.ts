import { ApiPropertyOptional } from '@nestjs/swagger'

import { IsOptional, IsString, IsArray, IsInt, Min } from 'class-validator'

export class CreatePostSectionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  id?: number

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
  description_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_en?: string

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number
}
