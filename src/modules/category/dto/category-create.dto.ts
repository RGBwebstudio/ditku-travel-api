import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'
import { ProductCreateDto } from 'src/modules/product/dto/product-create.dto'
import { Category } from '../entities/category.entity'

export class CategoryCreateDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  show_on_main_page: boolean

  @ApiProperty({ example: null })
  @IsNumber()
  @IsOptional()
  parent: Category

  @ApiProperty({ example: 'Фрукти та овочі' })
  @IsString()
  title: string

  @ApiProperty({ example: 'frukty-ta-ovochi' })
  @IsString()
  url: string

  @ApiProperty({ example: 'Це сео-текст' })
  @IsString()
  seo_text: string
  @ApiProperty({ example: 0, nullable: false })
  @IsInt()
  order_in_list: number
}

export class CategoryCreateResponseDto {
  @ApiProperty({ example: 1 })
  @IsString()
  id: number

  @ApiProperty({ example: 'Яблука' })
  @IsString()
  title: string

  @ApiProperty({ example: 'yabluka' })
  @IsString()
  url: string
  @ApiProperty({ example: 0 })
  @IsInt()
  order_in_list: number

  @ApiProperty({
    required: true,
    nullable: false,
    type: () => [ProductCreateDto]
  })
  @IsArray()
  products: ProductCreateDto[]
}
