import { PartialType } from '@nestjs/swagger'
import { CreateMainPageDto } from './create-main-page.dto'

export class UpdateMainPageDto extends PartialType(CreateMainPageDto) {}
