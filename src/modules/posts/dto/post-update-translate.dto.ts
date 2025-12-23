import { PartialType } from '@nestjs/swagger'

import { PostCreateTranslateDto } from './post-create-translate.dto'

export class PostUpdateTranslateDto extends PartialType(PostCreateTranslateDto) {}
