import { ApiProperty } from '@nestjs/swagger'
import { ImageResponseDto } from './image-response.dto'

export class ImageListResponseDto {
  @ApiProperty({
    type: [ImageResponseDto],
    description: 'Array of images',
  })
  data: ImageResponseDto[]

  @ApiProperty({ example: 100, description: 'Total number of images' })
  total: number

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number

  @ApiProperty({ example: 20, description: 'Number of items per page' })
  limit: number

  @ApiProperty({ example: 5, description: 'Total number of pages' })
  totalPages: number
}
