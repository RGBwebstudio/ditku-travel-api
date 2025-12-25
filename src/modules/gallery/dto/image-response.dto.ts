import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ImageCategoryResponseDto {
  @ApiProperty({ example: 1, description: 'Category ID' })
  id: number

  @ApiProperty({ example: 'Products', description: 'Category name' })
  name: string

  @ApiPropertyOptional({ example: null, description: 'Parent category ID' })
  parentId: number | null

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation date' })
  createdAt: Date

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update date' })
  updatedAt: Date
}

export class ImageResponseDto {
  @ApiProperty({ example: 1, description: 'Image ID' })
  id: number

  @ApiPropertyOptional({ example: 1, description: 'Category ID' })
  categoryId: number | null

  @ApiPropertyOptional({ type: ImageCategoryResponseDto, description: 'Category details' })
  category: ImageCategoryResponseDto | null

  @ApiProperty({ example: 'product-image.jpg', description: 'Original filename' })
  originalName: string

  @ApiPropertyOptional({
    example: 'uploads/2024/01/uuid_lg.avif',
    description: 'Path to large size image',
  })
  path_lg: string | null

  @ApiPropertyOptional({
    example: 'uploads/2024/01/uuid_md.avif',
    description: 'Path to medium size image',
  })
  path_md: string | null

  @ApiPropertyOptional({
    example: 'uploads/2024/01/uuid_sm.avif',
    description: 'Path to small size image',
  })
  path_sm: string | null

  @ApiProperty({ example: 'image/avif', description: 'Image content type' })
  contentType: string

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation date' })
  createdAt: Date

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update date' })
  updatedAt: Date
}
