import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator'
import { Product } from 'src/product/entities/product.entity'

export class ProductPromotionCreateDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  show_on_main_page: boolean

  @ApiPropertyOptional({ example: '123' })
  @IsString()
  @IsOptional()
  custom_id: string

  @ApiProperty({ example: 'Акція для яблук' })
  @IsString()
  title: string

  @ApiProperty({ example: 'Опис акції' })
  @IsString()
  description: string

  @ApiProperty({ example: '10.000' })
  @IsString()
  from_amount: string

  @ApiProperty({ example: 15 })
  @IsInt()
  discount: number

  @ApiProperty({ example: 0 })
  @IsInt()
  priority: number

  @ApiProperty({ example: [1] })
  @IsInt({ each: true })
  @IsPositive({ each: true })
  products: Product[]
}
