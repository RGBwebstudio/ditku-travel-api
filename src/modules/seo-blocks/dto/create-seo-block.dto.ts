import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateSeoBlockDto {
  @ApiPropertyOptional({ example: 'delivery-tariffs' })
  @IsString()
  key: string

  @ApiPropertyOptional({ example: 'Title for page' })
  @IsString()
  meta_title: string

  @ApiPropertyOptional({ example: 'Description for page' })
  @IsString()
  meta_description: string

  @ApiPropertyOptional({ example: 'SEO text' })
  @IsString()
  seo_text: string
}
