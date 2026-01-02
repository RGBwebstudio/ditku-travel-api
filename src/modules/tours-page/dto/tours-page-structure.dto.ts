import { ApiPropertyOptional } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator'

export class HeroSection {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitle?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  input_search_placeholder?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  button_text?: string
}

export class IndividualToursSection {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  button_text?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string
}

export class EducationBlock {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string
}

export class EducationSection {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({ type: [EducationBlock] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationBlock)
  blocks?: EducationBlock[]
}

export class WhyTravelBlock {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bg_color?: string
}

export class WhyTravelSection {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({ type: [WhyTravelBlock] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WhyTravelBlock)
  blocks?: WhyTravelBlock[]
}

export class ConsultationSection {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitle?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  button_text?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  input_name_label?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  input_name_placeholder?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  input_phone_label?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  input_phone_placeholder?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  option_1_text?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  option_2_text?: string
}

export class ColoredSliderBlock {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bg_color?: string
}

export class ColoredSliderSection {
  @ApiPropertyOptional({ type: [ColoredSliderBlock] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColoredSliderBlock)
  blocks?: ColoredSliderBlock[]
}

export class SeoSection {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_description?: string
}

export class ToursPageStructureDto {
  @ApiPropertyOptional({ type: () => HeroSection })
  @IsOptional()
  @ValidateNested()
  @Type(() => HeroSection)
  hero_section?: HeroSection

  @ApiPropertyOptional({ type: () => IndividualToursSection })
  @IsOptional()
  @ValidateNested()
  @Type(() => IndividualToursSection)
  individual_tours_section?: IndividualToursSection

  @ApiPropertyOptional({ type: () => EducationSection })
  @IsOptional()
  @ValidateNested()
  @Type(() => EducationSection)
  education_section?: EducationSection

  @ApiPropertyOptional({ type: () => WhyTravelSection })
  @IsOptional()
  @ValidateNested()
  @Type(() => WhyTravelSection)
  why_travel_section?: WhyTravelSection

  @ApiPropertyOptional({ type: () => ConsultationSection })
  @IsOptional()
  @ValidateNested()
  @Type(() => ConsultationSection)
  consultation_section?: ConsultationSection

  @ApiPropertyOptional({ type: () => ColoredSliderSection })
  @IsOptional()
  @ValidateNested()
  @Type(() => ColoredSliderSection)
  colored_slider_section?: ColoredSliderSection

  @ApiPropertyOptional({ type: () => SeoSection })
  @IsOptional()
  @ValidateNested()
  @Type(() => SeoSection)
  seo_section?: SeoSection

  @IsOptional()
  cta_section?: any
}
