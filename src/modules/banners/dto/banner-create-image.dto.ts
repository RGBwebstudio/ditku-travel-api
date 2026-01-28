import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator'

import { BannerGroup } from '../entities/banners.entity'

export class BannerCreateImageDto {
  @IsString()
  name: string

  @IsString()
  link: string

  @IsString()
  path: string

  @IsString()
  @IsOptional()
  path_md?: string

  @IsString()
  @IsOptional()
  path_sm?: string

  @IsInt()
  @IsPositive()
  entity_id: BannerGroup | number
}
