import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator'
import { BannerGroup } from '../entities/banners.entity'

export class BannerCreateImageDto {
  @IsString()
  @IsOptional()
  custom_id: string

  @IsString()
  name: string

  @IsString()
  link: string

  @IsString()
  path: string

  @IsInt()
  @IsPositive()
  entity_id: BannerGroup | number
}
