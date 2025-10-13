import { IsString, IsOptional, IsInt, Min } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PostCreateImageDto {
  @ApiPropertyOptional({ example: '123' })
  @IsString()
  @IsOptional()
  custom_id?: string

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
