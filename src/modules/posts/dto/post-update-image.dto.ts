import { PartialType } from '@nestjs/swagger'
import { PostCreateImageDto } from './post-create-image.dto'

export class PostUpdateImageDto extends PartialType(PostCreateImageDto) {}
