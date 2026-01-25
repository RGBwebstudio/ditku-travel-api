import { ApiProperty } from '@nestjs/swagger'

import { IsEnum, IsInt, IsPositive, IsString } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'

import { Product } from '../entities/product.entity'

export class ProductCreateTranslateDto {
  @ApiProperty({ example: 'title' })
  @IsString()
  field: string

  @ApiProperty({ example: 'переклад' })
  @IsString()
  value: string

  @ApiProperty({ example: LANG.EN })
  @IsEnum(LANG)
  lang: LANG

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  entity_id: Product
}
