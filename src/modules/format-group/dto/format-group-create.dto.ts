import { ApiProperty } from '@nestjs/swagger'

import { IsOptional, IsString } from 'class-validator'

export class FormatGroupCreateDto {
  @ApiProperty({ example: '8-10' })
  @IsString()
  title: string

  @ApiProperty({ example: '8-10' })
  @IsString()
  value: string

  @ApiProperty({ example: 'title_ua' })
  @IsString()
  title_ua: string

  @ApiProperty({ example: 'title_en' })
  @IsString()
  title_en: string

  @ApiProperty({ example: 'subtitle', required: false })
  @IsString()
  @IsOptional()
  subtitle?: string

  @ApiProperty({ example: 'subtitle_ua', required: false })
  @IsString()
  @IsOptional()
  subtitle_ua?: string

  @ApiProperty({ example: 'subtitle_en', required: false })
  @IsString()
  @IsOptional()
  subtitle_en?: string
}
