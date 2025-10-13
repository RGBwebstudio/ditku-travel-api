import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CreateDiscountDto {
  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  custom_id?: string

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  title?: string
}
