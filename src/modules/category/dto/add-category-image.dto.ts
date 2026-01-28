import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class AddCategoryImageDto {
  @ApiProperty({
    description: 'Image path or URL (from Gallery)',
    example: 'https://cdn.example.com/images/cat.avif',
  })
  @IsString()
  @IsNotEmpty()
  path: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  path_md?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  path_sm?: string
}
