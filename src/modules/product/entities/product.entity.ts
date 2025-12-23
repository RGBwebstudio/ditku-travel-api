import { Category } from 'src/modules/category/entities/category.entity'
import { FormatGroup } from 'src/modules/format-group/entities/format-group.entity'
import { Parameter } from 'src/modules/parameter/entities/parameter.entity'
import { Rating } from 'src/modules/product-rating/entities/rating.entity'
import { Roadmap } from 'src/modules/roadmap/entities/roadmap.entity'
import { Section } from 'src/modules/section/entities/section.entity'
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
import { ProductTranslate } from './product-translate.entity'

@Entity()
@Index(['category_id', 'show_on_main_page', 'created_at'])
@Index(['show_on_main_page', 'created_at'])
@Index(['category_id'])
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
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

  @Column({ type: 'jsonb', nullable: true })
  structure: any

  @Column({ default: 0 })
  order_in_list: number

  @Column({ default: false })
  show_on_main_page: boolean

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
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category_id: Category

  @ManyToMany(() => Parameter, (parameter: Parameter) => parameter.products, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'product_parameters',
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

  @CreateDateColumn({ type: 'timestamptz' })
  start_at: Date

  @CreateDateColumn({ type: 'timestamptz' })
  end_at: Date

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date

  rating?: number
}
