import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateIf
} from 'class-validator'

export class UpdateRoadmapArrayItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number

  @ApiProperty({ example: true })
  @IsBoolean()
  start_point: boolean

  @ApiProperty({ example: false })
  @IsBoolean()
  end_point: boolean

  @ApiPropertyOptional({ example: null })
  @ValidateIf((o) => o.city_id !== null && o.city_id !== undefined)
  @IsInt()
  city_id?: number | null

  @ApiProperty({ example: '10:00' })
  @IsString()
  time: string

  @ApiPropertyOptional({ example: 'Опис пункту маршруту' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ example: 0 })
  @ValidateIf((o) => o.order !== null && o.order !== undefined)
  @IsInt()
  order?: number | null
}
