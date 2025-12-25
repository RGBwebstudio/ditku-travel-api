import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AddCategoryImageDto {
  @ApiProperty({
    description: 'Image path or URL (from Gallery)',
    example: 'https://cdn.example.com/images/cat.avif',
  })
  @IsString()
  @IsNotEmpty()
  path: string
}
