import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class CreateRoadmapDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  product_id: number

  @ApiProperty({ example: true })
  @IsBoolean()
  start_point: boolean

  @ApiProperty({ example: true })
  @IsBoolean()
  end_point: boolean

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  city_id?: number

  @ApiProperty({ example: '10:00' })
  @IsString()
  time: string

  @ApiPropertyOptional({ example: 'Опис пункту маршруту' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsString()
  order?: string
}
