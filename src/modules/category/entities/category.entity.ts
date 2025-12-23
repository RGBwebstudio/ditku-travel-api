import { Menu } from 'src/modules/menu/entities/menu.entity'
import { Product } from 'src/modules/product/entities/product.entity'
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
} from 'typeorm'

import { CategoryImage } from './category-image.entity'
import { CategoryTranslate } from './category-translate.entity'

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

  @OneToMany(() => Product, (product) => product.category_id)
  products: Product[]

  @OneToMany(() => CategoryTranslate, (translate) => translate.entity_id)
  translates: CategoryTranslate[]

  @OneToMany(() => CategoryImage, (image) => image.entity_id)
  images: CategoryImage[]

  @OneToMany(() => Menu, (menu) => menu.category_id)
  menus: Menu[]

  @Column({ default: 0 })
  order_in_list: number

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date

  products_count?: number

  parameter_categories?: any[]
}
