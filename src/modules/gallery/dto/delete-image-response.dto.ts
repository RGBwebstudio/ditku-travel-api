import { ApiProperty } from '@nestjs/swagger'

export class DeleteImageResponseDto {
  @ApiProperty({ example: true, description: 'Deletion success status' })
  success: boolean
}
