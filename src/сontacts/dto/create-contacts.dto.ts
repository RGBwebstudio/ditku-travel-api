import { Optional } from '@nestjs/common'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'

export class CreateContactsDto {
  @ApiProperty({ example: '{}' })
  @IsString()
  structure: string

  @ApiProperty({ example: LANG.UA })
  @IsEnum(LANG)
  lang: LANG

  @ApiProperty({ example: 'seo title' })
  @IsString()
  seo_title: string

  @ApiProperty({ example: 'seo description' })
  @IsString()
  seo_description: string

  @ApiProperty({ example: 'seo text' })
  @IsString()
  seo_text: string
}
