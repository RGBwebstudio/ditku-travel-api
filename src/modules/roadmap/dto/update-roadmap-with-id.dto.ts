import { IsInt } from 'class-validator'

import { UpdateRoadmapDto } from './update-roadmap.dto'

export class UpdateRoadmapWithIdDto extends UpdateRoadmapDto {
  @IsInt()
  id: number
}
