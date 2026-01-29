import { Exclude } from 'class-transformer'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  JoinTable,
  Tree,
  TreeChildren,
  TreeParent,
  OneToMany,
} from 'typeorm'

import { SeoFilterCategoryItem } from './seo-filter-category-item.entity'
import { SeoFilterTranslate } from './seo-filter-translate.entity'
import { Category } from '../../category/entities/category.entity'
import { City } from '../../city/entities/city.entity'
import { Country } from '../../country/entities/country.entity'
import { Menu } from '../../menu/entities/menu.entity'
import { Post } from '../../posts/entities/post.entity'
import { Product } from '../../product/entities/product.entity'

@Entity()
@Tree('closure-table')
export class SeoFilter {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  title: string

  @Column({ unique: true })
  url: string

  @Column({ nullable: true })
  navigator_title: string

  @Column({ nullable: true })
  seo_title: string

  @Column({ nullable: true })
  seo_description: string

  @Column({ type: 'text', nullable: true })
  seo_text: string

  @Column({ type: 'jsonb', default: {} })
  structure: any

  @ManyToOne(() => Category, (category) => category.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category_id: Category

  @ManyToOne(() => City, (city) => city.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'city_id' })
  city_id: City

  @ManyToOne(() => Country, (country) => country.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'country_id' })
  country_id: Country

  @ManyToMany(() => Menu, (menu) => menu.seo_filters)
  menus: Menu[]

  @Exclude()
  @ManyToMany(() => Product, (product) => product.seo_filters)
  products: Product[]

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'seo_filter_popular_tours',
    joinColumn: { name: 'seo_filter_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  popular_tours: Product[]

  @ManyToMany(() => Post)
  @JoinTable({
    name: 'seo_filter_recommended_posts',
    joinColumn: { name: 'seo_filter_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'post_id', referencedColumnName: 'id' },
  })
  recommended_posts: Post[]

  @OneToMany(() => SeoFilterCategoryItem, (item) => item.seo_filter_owner, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  category_items: SeoFilterCategoryItem[]

  @OneToMany(() => SeoFilterTranslate, (translate) => translate.entity_id)
  translates: SeoFilterTranslate[]

  @TreeParent()
  parent?: SeoFilter

  @TreeChildren()
  children?: SeoFilter[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date

  products_count?: number
}
