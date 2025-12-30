import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsOptional, IsString, ValidateNested } from 'class-validator'
import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'

import { PostFilterDto } from './post-filter.dto'

export class PostQueryDto extends IntersectionType(TakeAndSkipDto, PostFilterDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => PostFilterDto)
  filter?: PostFilterDto

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sort?: string
}
