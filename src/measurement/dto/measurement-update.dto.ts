import { PartialType } from '@nestjs/swagger'
import { MeasurementCreateDto } from './measurement-create.dto'

export class MeasurementUpdateDto extends PartialType(MeasurementCreateDto) {}
