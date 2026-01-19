import { ApiProperty } from '@nestjs/swagger'

import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator'

import { PageType } from '../../page-constructor/entities/page-constructor.entity'

export class CreatePageConstructorCategoryDto {
  @ApiProperty({ example: 'Нова категорія', description: 'Назва категорії' })
  @IsString()
  @MinLength(1)
  title_ua: string

  @ApiProperty({
    example: 'New Category',
    description: 'Назва категорії (EN)',
    required: false,
  })
  @IsString()
  @IsOptional()
  title_en?: string

  @ApiProperty({
    enum: PageType,
    description: 'Тип категорії (for-parent або for-teachers)',
  })
  @IsEnum(PageType)
  type: PageType
}
