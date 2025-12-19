import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'
import { UpdateRoadmapDto } from './update-roadmap.dto'

export class UpdateRoadmapItemDto extends UpdateRoadmapDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number
}
