import { ApiPropertyOptional } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsOptional, IsString, IsInt, IsBoolean } from 'class-validator'

export class PostFilterDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  category_id?: number

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_hidden?: boolean

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_top_main?: boolean

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_top_side?: boolean

  @ApiPropertyOptional({ example: 'заголовок' })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number
}
