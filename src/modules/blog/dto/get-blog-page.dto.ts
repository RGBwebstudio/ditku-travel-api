import { ApiPropertyOptional } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator'

import { LANG } from '../../../common/enums/translation.enum'

export class GetBlogPageDto {
  @ApiPropertyOptional({ enum: LANG })
  @IsOptional()
  @IsEnum(LANG)
  lang?: LANG

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  category_id?: number

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 9
}
