import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator'
import { BannerType } from 'src/common/types/banner-group.types'

export class BannerCreateDto {
  @ApiProperty({ example: 'Акція манго -20%' })
  @IsString()
  title: string

  @ApiProperty({ example: BannerType.MAIN_PAGE })
  @IsEnum(BannerType)
  type: BannerType.UNCATEGORIZED

  @ApiProperty({ example: 0 })
  @IsInt()
  order: number
}
