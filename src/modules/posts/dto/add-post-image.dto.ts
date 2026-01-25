import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator'

export class AddPostImageDto {
  @ApiProperty({
    description: 'Image path or URL (from Gallery)',
    example: 'https://cdn.example.com/images/2024/01/pic.avif',
  })
  @IsString()
  @IsNotEmpty()
  path: string
}
