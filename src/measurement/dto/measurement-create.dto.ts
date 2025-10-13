import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class MeasurementCreateDto {
  @ApiPropertyOptional({ example: '123' })
  @IsString()
  @IsOptional()
  custom_id: string

  @ApiProperty({ example: 'Кілограм' })
  @IsString()
  title: string

  @ApiProperty({ example: 'кг' })
  @IsString()
  title_short: string
}
