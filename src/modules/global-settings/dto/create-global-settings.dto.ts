import { ApiProperty } from '@nestjs/swagger'

import { IsEnum, IsOptional, IsString } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'

export class CreateGlobalSettingsDto {
  @ApiProperty({ example: '{}' })
  @IsString()
  structure: string

  @ApiProperty({ example: 'Ready to travel?' })
  @IsString()
  @IsOptional()
  cta_title: string

  @ApiProperty({ example: 'Discover the world with us' })
  @IsString()
  @IsOptional()
  cta_subtitle: string

  @ApiProperty({ example: 'Join us today for an adventure.' })
  @IsString()
  @IsOptional()
  cta_text: string

  @ApiProperty({ example: 'Get Started' })
  @IsString()
  @IsOptional()
  cta_button_text: string

  @ApiProperty({ example: '/contact' })
  @IsString()
  @IsOptional()
  cta_link: string

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  cta_image: string

  @ApiProperty({ example: 'Готові подорожувати?' })
  @IsString()
  @IsOptional()
  cta_title_ua?: string

  @ApiProperty({ example: 'Ready to travel?' })
  @IsString()
  @IsOptional()
  cta_title_en?: string

  @ApiProperty({ example: 'Відкрийте світ з нами' })
  @IsString()
  @IsOptional()
  cta_subtitle_ua?: string

  @ApiProperty({ example: 'Discover the world with us' })
  @IsString()
  @IsOptional()
  cta_subtitle_en?: string

  @ApiProperty({ example: 'Почати' })
  @IsString()
  @IsOptional()
  cta_button_text_ua?: string

  @ApiProperty({ example: 'Get Started' })
  @IsString()
  @IsOptional()
  cta_button_text_en?: string

  @ApiProperty({ example: LANG.UA })
  @IsEnum(LANG)
  lang: LANG
}
