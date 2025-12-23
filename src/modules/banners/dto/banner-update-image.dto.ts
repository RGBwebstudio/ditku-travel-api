import { PartialType } from '@nestjs/swagger'

import { BannerCreateImageDto } from './banner-create-image.dto'

export class BannerUpdateImageDto extends PartialType(BannerCreateImageDto) {}
