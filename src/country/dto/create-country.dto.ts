import { Optional } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator'

export class CreateCountryDto {
  @ApiPropertyOptional({ example: '123' })
  @IsString()
  @Optional()
  custom_id: string

  @ApiProperty({ example: 'Україна' })
  @IsString()
  title: string

  @ApiPropertyOptional({ example: [1, 2, 3] })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  brand_ids?: number[]

  @ApiPropertyOptional({ example: 0 })
  @IsInt()
  @IsOptional()
  order_in_list?: number
}
