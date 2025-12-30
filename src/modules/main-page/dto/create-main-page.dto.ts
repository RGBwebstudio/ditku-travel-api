import { Optional } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsEnum, ValidateNested } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'
import { MainPageStructureDto } from './main-page-structure.dto'

export class CreateMainPageDto {
  @ApiProperty({ type: MainPageStructureDto })
  @ValidateNested()
  @Type(() => MainPageStructureDto)
  structure: MainPageStructureDto

  @ApiProperty({ example: LANG.UA })
  @IsEnum(LANG)
  lang: LANG
}
