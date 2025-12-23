import { ApiProperty } from '@nestjs/swagger'

import { IsInt, IsPositive } from 'class-validator'

export class ProductUploadImageDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  entity_id: number
}
