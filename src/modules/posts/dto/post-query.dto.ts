import { IntersectionType } from '@nestjs/swagger'

import { TakeAndSkipDto } from 'src/common/dto/TakeAndSkipDto.dto'

import { PostFilterDto } from './post-filter.dto'

export class PostQueryDto extends IntersectionType(TakeAndSkipDto, PostFilterDto) {}
