import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class AddBannerImageDto {
  @ApiProperty({
    description: 'Image path or URL (from Gallery)',
    example: 'https://cdn.example.com/images/2024/01/pic.avif',
  })
  @IsString()
  @IsNotEmpty()
  path: string

  @ApiPropertyOptional({
    description: 'Click-through link for the banner',
    example: 'https://myshop.com/promo',
  })
  @IsOptional()
  @IsString()
  link?: string
}
