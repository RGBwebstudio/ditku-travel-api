import { PartialType } from '@nestjs/swagger'

import { RatingCreateDto } from './rating-create.dto'

export class RatingUpdateDto extends PartialType(RatingCreateDto) {}
