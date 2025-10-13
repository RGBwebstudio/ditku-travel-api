import { PartialType } from '@nestjs/swagger'
import { StockCreateDto } from './stock-create.dto'

export class StockUpdateDto extends PartialType(StockCreateDto) {}
