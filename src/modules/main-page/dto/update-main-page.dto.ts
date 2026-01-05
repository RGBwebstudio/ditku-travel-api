import { ApiPropertyOptional } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'

import { MainPageStructureDto } from './main-page-structure.dto'

export class UpdateMainPageDto {
  @ApiPropertyOptional({ type: MainPageStructureDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MainPageStructureDto)
  structure?: MainPageStructureDto

  @ApiPropertyOptional({ example: LANG.UA })
  @IsOptional()
  @IsEnum(LANG)
  lang?: LANG

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string
}
