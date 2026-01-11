import { ApiPropertyOptional } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator'

export class ClosestTours {
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
  photo?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  age_label?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  button_text_from?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  button_text_currency?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  learning_label?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  skills_label?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bg_image?: string

  @ApiPropertyOptional()
  @IsOptional()
  labels?: any

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
  description_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  age_label_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  age_label_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  button_text_from_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  button_text_from_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  skills_label_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  skills_label_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  learning_label_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  learning_label_en?: string
}

export class ImprovementCard {
  @ApiPropertyOptional()
  @IsOptional()
  id?: number // Permissive type for ID

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
  photo?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon_type?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon_bg_color?: string

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

export class ImprovementSection {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_main?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_highlight?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_main_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_main_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_highlight_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_highlight_en?: string

  @ApiPropertyOptional({ type: [ImprovementCard] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImprovementCard)
  cards?: ImprovementCard[]
}

export class VideoReviewItem {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  youtube_id?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preview?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preview_image?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string
}

export class VideoReviewTab {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({ type: [VideoReviewItem] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VideoReviewItem)
  videos?: VideoReviewItem[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string
}

export class VideoReviews {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({ type: [VideoReviewTab] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VideoReviewTab)
  tabs?: VideoReviewTab[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string
}

export class BlogTab {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string
}

export class BlogArticle {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  date?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string
}

export class BlogSection {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  link_text?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  button_text?: string

  @ApiPropertyOptional({ type: [BlogTab] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlogTab)
  tabs?: BlogTab[]

  @ApiPropertyOptional({ type: [BlogArticle] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlogArticle)
  articles?: BlogArticle[]
}

export class PopularTourCard {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photo?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  link?: string
}

export class PopularTours {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({ type: [PopularTourCard] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PopularTourCard)
  cards?: PopularTourCard[]
}

export class SliderItem {
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
  image?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  color?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text_en?: string
}

export class Banner {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_top?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_bottom?: string

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
  banner_title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banner_text_hightlight?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_top_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_bottom_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  button_text_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_top_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_bottom_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  button_text_ua?: string
}

export class ChooseTourItem {
  @ApiPropertyOptional()
  @IsOptional()
  id?: number | string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text?: string

  @ApiPropertyOptional({
    description:
      'Expected values: car, hotel, ukraine-map, plane, briefcase, puzzle, compass, phd, group, pensil, care, microscope, pen, book, global, flask, diagram',
    example: 'car',
  })
  @IsOptional()
  @IsString()
  icon?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  icon_bg_color?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photo?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  link_slug?: string

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
  description_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description_en?: string
}

export class ChooseTourTab {
  @ApiPropertyOptional()
  @IsOptional()
  id?: number | string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string

  @ApiPropertyOptional({ type: [ChooseTourItem] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChooseTourItem)
  items?: ChooseTourItem[]
}

export class ChooseTourSection {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_main?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_highlight?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_main_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_main_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_highlight_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_highlight_en?: string

  @ApiPropertyOptional({ type: [ChooseTourTab] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChooseTourTab)
  tabs?: ChooseTourTab[]
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
  title?: string

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
  title_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_part_1_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_part_1_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_highlight_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_highlight_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_part_2_ua?: string

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

export class SafetyAndTrustItem {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text?: string

  @ApiPropertyOptional({
    description: 'Expected values: orange, pink, yellow',
    example: 'orange',
  })
  @IsOptional()
  @IsString()
  variant?: string

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

export class SafetyAndTrustSection {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_pink?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_black_1?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_black_2?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_highlight_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_highlight_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_middle_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_middle_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_main_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title_main_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photo?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  main_photo?: string

  @ApiPropertyOptional({ type: [SafetyAndTrustItem] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SafetyAndTrustItem)
  items?: SafetyAndTrustItem[]

  @ApiPropertyOptional({ type: [SafetyAndTrustItem] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SafetyAndTrustItem)
  cards?: SafetyAndTrustItem[]
}

export class DocumentItem {
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
  url?: string
}

export class OurDocumentsSection {
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

  @ApiPropertyOptional({ type: [DocumentItem] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentItem)
  docs?: DocumentItem[]
}

export class SeoSection {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_text?: string

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
  seo_text_ua?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seo_text_en?: string
}

export class ExperienceCard {
  @ApiPropertyOptional()
  @IsOptional()
  id?: number | string

  @ApiPropertyOptional({ description: 'The statistic number, e.g. "23"' })
  @IsOptional()
  @IsString()
  number?: string

  @ApiPropertyOptional({ description: 'The statistic number in Ukrainian' })
  @IsOptional()
  @IsString()
  number_ua?: string

  @ApiPropertyOptional({ description: 'The statistic number in English' })
  @IsOptional()
  @IsString()
  number_en?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text?: string

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
  image?: string

  @ApiPropertyOptional({ description: 'Color variant for the card' })
  @IsOptional()
  @IsString()
  color?: string
}

export class MainPageStructureDto {
  @ApiPropertyOptional({ type: () => ClosestTours })
  @IsOptional()
  @ValidateNested()
  @Type(() => ClosestTours)
  closest_tours?: ClosestTours

  @ApiPropertyOptional({ type: () => SeoSection })
  @IsOptional()
  @ValidateNested()
  @Type(() => SeoSection)
  seo_section?: SeoSection

  @ApiPropertyOptional({ type: [ExperienceCard] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceCard)
  experience_cards?: ExperienceCard[]

  @IsOptional()
  cta_section?: any

  @ApiPropertyOptional({ type: () => ChooseTourSection })
  @IsOptional()
  @ValidateNested()
  @Type(() => ChooseTourSection)
  choose_tour?: ChooseTourSection

  @ApiPropertyOptional({ type: () => ImprovementSection })
  @IsOptional()
  @ValidateNested()
  @Type(() => ImprovementSection)
  improvement_section?: ImprovementSection

  @ApiPropertyOptional({ type: () => PhotoReportSection })
  @IsOptional()
  @ValidateNested()
  @Type(() => PhotoReportSection)
  photo_report?: PhotoReportSection

  @ApiPropertyOptional({ type: () => VideoReviews })
  @IsOptional()
  @ValidateNested()
  @Type(() => VideoReviews)
  video_reviews?: VideoReviews

  @ApiPropertyOptional({ type: () => BlogSection })
  @IsOptional()
  @ValidateNested()
  @Type(() => BlogSection)
  blog_section?: BlogSection

  @ApiPropertyOptional({ type: () => PopularTours })
  @IsOptional()
  @ValidateNested()
  @Type(() => PopularTours)
  popular_tours?: PopularTours

  @ApiPropertyOptional({ type: [SliderItem] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SliderItem)
  slider_data?: SliderItem[]

  // Legacy/Existing properties
  @ApiPropertyOptional({ type: () => Banner })
  @IsOptional()
  @ValidateNested()
  @Type(() => Banner)
  banner?: Banner

  @ApiPropertyOptional()
  @IsOptional()
  slider?: any

  @ApiPropertyOptional()
  @IsOptional()
  journey?: any

  @ApiPropertyOptional()
  @IsOptional()
  journey_photos?: any

  @ApiPropertyOptional({ type: () => SafetyAndTrustSection })
  @IsOptional()
  @ValidateNested()
  @Type(() => SafetyAndTrustSection)
  safety_and_trust?: SafetyAndTrustSection

  @ApiPropertyOptional({ type: () => OurDocumentsSection })
  @IsOptional()
  @ValidateNested()
  @Type(() => OurDocumentsSection)
  our_documents?: OurDocumentsSection

  @ApiPropertyOptional()
  @IsOptional()
  child_development?: any

  @ApiPropertyOptional()
  @IsOptional()
  blog_and_popular?: any

  @ApiPropertyOptional()
  @IsOptional()
  cta_and_seo?: any

  @ApiPropertyOptional()
  @IsOptional()
  slider_section?: any
}
