import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreateFaqDto {
  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  show_in_product?: boolean
  @ApiPropertyOptional({
    example: 'Чому я не сокіл, чому не літаю, Чому мені, боже, ти криллів не дав?',
  })
  @IsString()
  @IsOptional()
  title: string

  @ApiPropertyOptional({ example: 'Я б землю покинув і в небо злітав!' })
  @IsString()
  @IsOptional()
  text: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title_ua: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title_en: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  text_ua: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  text_en: string
}
