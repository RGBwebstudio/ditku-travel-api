import { ApiProperty } from '@nestjs/swagger'

import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'

import { City } from '../entities/city.entity'

export class CityCreateTranslateDto {
  @ApiProperty({ example: 'title' })
  @IsString()
  @IsNotEmpty()
  field: string

  @ApiProperty({ example: 'Київ' })
  @IsString()
  @IsNotEmpty()
  value: string

  @ApiProperty({ example: LANG.UA })
  @IsEnum(LANG)
  lang: LANG

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  entity_id: City
}
