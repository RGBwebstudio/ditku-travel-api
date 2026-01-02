import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class ProductFilterDto {
  @ApiPropertyOptional({ example: 'frukty-ta-ovochi,yabluka' })
  @IsString()
  @IsOptional()
  categories: string

  @ApiPropertyOptional({ example: '1,2' })
  @IsString()
  @IsOptional()
  parameters: string

  @ApiPropertyOptional({ example: '1,2' })
  @IsString()
  @IsOptional()
  sections: string

  @ApiProperty({ example: 15 })
  @IsInt()
  @Min(0)
  @IsOptional()
  take: number

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  skip: number

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  minPrice: number

  @ApiPropertyOptional({ example: 100000 })
  @IsOptional()
  maxPrice: number

  @ApiPropertyOptional({ example: '2023-12-01T00:00:00Z' })
  @IsString()
  @IsOptional()
  startAt: string

  @ApiPropertyOptional({ example: '2023-12-31T23:59:59Z' })
  @IsString()
  @IsOptional()
  endAt: string

  @ApiPropertyOptional({
    example: 1,
    description: 'Id міста для фільтрації по start_point (roadmap.city_id) - обране лише одне',
  })
  @IsOptional()
  start_point: number

  @ApiPropertyOptional({
    example: 2,
    description: 'Id міста для фільтрації по end_point (roadmap.city_id) - обране лише одне',
  })
  @IsOptional()
  end_point: number

  @ApiPropertyOptional({
    example: 1,
    description: 'SEO Filter ID to filter products by seo_filter relation',
  })
  @IsOptional()
  seo_filter?: number
}
