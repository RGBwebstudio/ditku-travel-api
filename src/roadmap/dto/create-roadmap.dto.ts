import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class CreateRoadmapDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  product_id: number

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
