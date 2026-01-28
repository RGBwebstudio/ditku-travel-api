import { ApiProperty } from '@nestjs/swagger'

import { IsString, IsInt, Min, IsNotEmpty, IsOptional } from 'class-validator'

export class PostCreateImageDto {
  @ApiProperty({ example: 'post-image.jpg' })
  @IsString()
  name: string

  @ApiProperty({ example: '/uploads/posts/post-image.jpg' })
  @IsString()
  @IsNotEmpty()
  path: string

  @ApiProperty({ example: '/uploads/posts/post-image-md.jpg', required: false })
  @IsString()
  @IsOptional()
  path_md?: string

  @ApiProperty({ example: '/uploads/posts/post-image-sm.jpg', required: false })
  @IsString()
  @IsOptional()
  path_sm?: string

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  order: number
}
