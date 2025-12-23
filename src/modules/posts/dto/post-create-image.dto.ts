import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsString, IsOptional, IsInt, Min } from 'class-validator'

export class PostCreateImageDto {
  @ApiProperty({ example: 'post-image.jpg' })
  @IsString()
  name: string

  @ApiProperty({ example: '/uploads/posts/post-image.jpg' })
  @IsString()
  path: string

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  order: number
}
