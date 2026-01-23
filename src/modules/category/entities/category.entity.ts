import { Exclude } from 'class-transformer'
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Tree,
  TreeChildren,
  TreeParent,
  Index,
  ManyToMany,
  JoinTable,
} from 'typeorm'

import { CategoryImage } from './category-image.entity'
import { CategoryTranslate } from './category-translate.entity'
import { Menu } from '../../menu/entities/menu.entity'
import { Product } from '../../product/entities/product.entity'
import { SeoFilter } from '../../seo-filter/entities/seo-filter.entity'

@Entity()
@Tree('closure-table', {
  closureTableName: 'category',
})
@Index(['url'])
@Index(['show_on_main_page', 'created_at'])
export class Category {
  @PrimaryGeneratedColumn()
  id: number
  @TreeParent()
  parent: Category | null

  @TreeChildren()
  children: Category[] | []

  @Column({ default: false })
  show_on_main_page: boolean

  @Column({ unique: true })
  title: string

  @Column()
  url: string

  @Column()
  seo_text: string

  @Exclude()
  @OneToMany(() => Product, (product) => product.category_id)
  products: Product[]

  @OneToMany(() => CategoryTranslate, (translate) => translate.entity_id)
  translates: CategoryTranslate[]

  @OneToMany(() => CategoryImage, (image) => image.entity_id)
  images: CategoryImage[]

  @OneToMany(() => Menu, (menu) => menu.category_id)
  menus: Menu[]

  @OneToMany(() => SeoFilter, (filter) => filter.category_id)
  seo_filters: SeoFilter[]

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'category_popular_tours',
    joinColumn: { name: 'category_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  popular_tours: Product[]

  @Column({ default: 0 })
  order_in_list: number

  @Column({ type: 'jsonb', default: {} })
  structure: any

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date

  products_count?: number

  parameter_categories?: any[]
}
