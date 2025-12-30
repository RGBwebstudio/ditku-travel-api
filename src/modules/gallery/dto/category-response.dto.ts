import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CategoryResponseDto {
  @ApiProperty({ example: 1, description: 'Category ID' })
  id: number

  @ApiProperty({ example: 'Vacation', description: 'Category Name' })
  name: string

  @ApiPropertyOptional({ example: 1, description: 'Parent Category ID' })
  parentId: number | null

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date
}
