import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm'

import { ProductImage } from './product-image.entity'
import { ProductProgram } from './product-program.entity'
import { ProductSection } from './product-section.entity'
import { ProductTranslate } from './product-translate.entity'
import { Category } from '../../category/entities/category.entity'
import { Faq } from '../../faq/entities/faq.entity'
import { FormatGroup } from '../../format-group/entities/format-group.entity'
import { Parameter } from '../../parameter/entities/parameter.entity'
import { Post } from '../../posts/entities/post.entity'
import { Rating } from '../../product-rating/entities/rating.entity'
import { Roadmap } from '../../roadmap/entities/roadmap.entity'
import { Section } from '../../section/entities/section.entity'
import { SeoFilter } from '../../seo-filter/entities/seo-filter.entity'

@Entity()
@Index(['category_id', 'show_on_main_page', 'created_at'])
@Index(['show_on_main_page', 'created_at'])
@Index(['category_id'])
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: false })
  is_top: boolean

  @Column()
  is_hidden: boolean

  @Column()
  title: string

  @Column()
  subtitle: string

  @Column()
  seo_title: string

  @Column({ type: 'text', default: '' })
  seo_description: string

  @Column()
  url: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: string

  @Column({ type: 'text', nullable: true })
  discover: string

  @Column({ type: 'text', nullable: true })
  skills: string

  @Column({ type: 'jsonb', nullable: true, default: [] })
  skills_list: any[]

  @Column({ type: 'varchar', nullable: true })
  age: string

  @Column({ type: 'jsonb', nullable: true })
  learning: any

  @Column({ type: 'jsonb', nullable: true })
  program: any

  @Column({ type: 'jsonb', nullable: true })
  inclusive: Array<{
    id?: string
    icon?: string
    bg_color?: string
    text_ua?: string
    text_en?: string
  }>

  @Column({ type: 'jsonb', nullable: true })
  notIncludes: Array<{ id?: string; text_ua?: string; text_en?: string }>

  @Column({ type: 'jsonb', nullable: true })
  advantages: any

  @Column({ type: 'jsonb', nullable: true })
  structure: any

  @Column({ type: 'jsonb', nullable: true })
  why_travel_section: any

  @ManyToMany(() => SeoFilter, (seoFilter: SeoFilter) => seoFilter.products, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'product_seo_filters',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'seo_filter_id', referencedColumnName: 'id' },
  })
  seo_filters: SeoFilter[]

  @Column({ default: 0 })
  order_in_list: number

  @Column({ default: false })
  show_on_main_page: boolean

  @Column({ default: false })
  show_in_popular_on_main_page: boolean

  @Column({ default: 0 })
  popular_count: number

  @Column({ default: false })
  is_popular: boolean

  @ManyToOne(() => Product, (product: Product) => product.parent_id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent_id: Product

  @ManyToOne(() => Category, (category: Category) => category.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category_id: Category

  @ManyToMany(() => Parameter, (parameter: Parameter) => parameter.products, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'product_and_parameter',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'parameter_id', referencedColumnName: 'id' },
  })
  parameters: Parameter[]

  @ManyToMany(() => FormatGroup, (formatGroup: FormatGroup) => formatGroup.products, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'product_format_group',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'group_format_id', referencedColumnName: 'id' },
  })
  format_groups: FormatGroup[]

  @ManyToMany(() => Section, (section: Section) => section.products, {
    onDelete: 'CASCADE',
  })
  sections: Section[]

  @ManyToMany(() => Product, (product: Product) => product.recommendedBy, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'product_recommendations',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'recommended_product_id',
      referencedColumnName: 'id',
    },
  })
  recommendedProducts: Product[]

  @ManyToMany(() => Product, (product: Product) => product.recommendedProducts)
  recommendedBy: Product[]

  @OneToMany(() => ProductTranslate, (translate: ProductTranslate) => translate.entity_id)
  translates: ProductTranslate[]

  @OneToMany(() => ProductImage, (image: ProductImage) => image.entity_id)
  images: ProductImage[]

  @OneToMany(() => Rating, (rating: Rating) => rating.product_id)
  ratings: Rating[]

  @OneToMany(() => Roadmap, (roadmap: Roadmap) => roadmap.product_id)
  roadmaps: Roadmap[]

  @OneToMany(() => ProductProgram, (program: ProductProgram) => program.product_id)
  programs: ProductProgram[]

  @OneToMany(() => ProductSection, (section: ProductSection) => section.product_id)
  productSections: ProductSection[]

  @Column({ type: 'timestamptz', nullable: true })
  start_at: Date

  @Column({ type: 'timestamptz', nullable: true })
  end_at: Date

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @Column({ type: 'varchar', nullable: true })
  faq_header_pink_ua: string

  @Column({ type: 'varchar', nullable: true })
  faq_header_pink_en: string

  @Column({ type: 'varchar', nullable: true })
  faq_header_black_ua: string

  @Column({ type: 'varchar', nullable: true })
  faq_header_black_en: string

  @ManyToMany(() => Faq, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'product_faqs',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'faq_id', referencedColumnName: 'id' },
  })
  faqs: Faq[]

  @ManyToMany(() => Post, { cascade: true })
  @JoinTable({
    name: 'product_posts',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'post_id', referencedColumnName: 'id' },
  })
  posts: Post[]

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
  rating?: number
}
