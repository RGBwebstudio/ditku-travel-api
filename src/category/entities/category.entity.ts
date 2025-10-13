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
  Index
} from 'typeorm'
import { Product } from 'src/product/entities/product.entity'
import { CategoryTranslate } from './category-translate.entity'
import { CategoryImage } from './category-image.entity'
import { CategoryIcons } from 'src/common/types/category.types'

@Entity()
@Tree('closure-table', {
  closureTableName: 'category'
})
@Index(['url'])
@Index(['show_on_main_page', 'created_at'])
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  custom_id: string

  @TreeParent()
  parent: Category | null

  @TreeChildren()
  children: Category[] | []

  @Column({ default: false })
  show_on_main_page: boolean

  @Column({ nullable: true })
  icon_name: CategoryIcons

  @Column({ unique: true })
  title: string

  @Column()
  url: string

  @Column()
  seo_text: string

  @Column({ default: false })
  is_packages: boolean

  @OneToMany(() => Product, (product) => product.category_id)
  products: Product[]

  @OneToMany(() => CategoryTranslate, (translate) => translate.entity_id)
  translates: CategoryTranslate[]

  @OneToMany(() => CategoryImage, (image) => image.entity_id)
  images: CategoryImage[]

  @Column({ default: 0 })
  order_in_list: number

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date

  products_count?: number

  parameter_categories?: any[]
}
