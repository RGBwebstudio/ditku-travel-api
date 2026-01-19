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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitle_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitle_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  input_search_placeholder_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  input_search_placeholder_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  button_text_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  button_text_en?: string
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  button_text_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  button_text_en?: string
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string
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
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitle_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitle_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  button_text_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  button_text_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  input_name_label_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  input_name_label_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  input_name_placeholder_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  input_name_placeholder_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  input_phone_label_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  input_phone_label_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  input_phone_placeholder_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  input_phone_placeholder_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  option_1_text_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  option_1_text_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  option_2_text_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  option_2_text_en?: string
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text_en?: string
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_title_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_description_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_description_en?: string
}

export class FiltersSection {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string
}

export class PhotoReportImage {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  url?: string
}

export class PhotoReportSection {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_part_1?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_highlight?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_part_2?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_part_1_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_highlight_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_part_2_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_part_1_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_highlight_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_part_2_en?: string

  @ApiPropertyOptional({ type: [PhotoReportImage] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhotoReportImage)
  images?: PhotoReportImage[]
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

  @ApiPropertyOptional({ type: () => FiltersSection })
  @IsOptional()
  @ValidateNested()
  @Type(() => FiltersSection)
  filters_section?: FiltersSection

  @ApiPropertyOptional({ type: () => PhotoReportSection })
  @IsOptional()
  @ValidateNested()
  @Type(() => PhotoReportSection)
  photo_report_section?: PhotoReportSection
}
