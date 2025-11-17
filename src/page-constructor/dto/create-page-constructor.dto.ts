import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsString, IsOptional } from 'class-validator'
import { LANG } from 'src/common/enums/translation.enum'
import { TypeLabels, PageType } from '../entities/page-constructor.entity'

export class CreatePageConstructorDto {
  @ApiProperty({ example: '{}' })
  @IsString()
  structure: string

  @ApiProperty({ example: LANG.UA })
  @IsEnum(LANG)
  lang: LANG

  @ApiProperty({ example: TypeLabels.text_block })
  @IsEnum(TypeLabels)
  content_type: TypeLabels

  @ApiPropertyOptional({ example: PageType.FOR_PARENT })
  @IsEnum(PageType)
  @IsOptional()
  page_type?: PageType
}
