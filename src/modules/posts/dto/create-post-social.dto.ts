import { ApiProperty } from '@nestjs/swagger'

import { IsEnum, IsString, IsOptional } from 'class-validator'

import { SocialType } from '../entities/post-social.entity'

export class CreatePostSocialDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  id?: number

  @ApiProperty({ enum: SocialType, example: SocialType.FACEBOOK })
  @IsEnum(SocialType)
  type: SocialType

  @ApiProperty({ example: 'https://facebook.com/post/123' })
  @IsString()
  url: string
}
