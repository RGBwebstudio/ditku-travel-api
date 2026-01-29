import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { ToursPage } from './tours-page.entity'
import { Category } from '../../category/entities/category.entity'
import { SeoFilter } from '../../seo-filter/entities/seo-filter.entity'
import { ToursPageCategoryItemType } from '../enums/tours-page-category-item-type.enum'

@Entity()
export class ToursPageCategoryItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int' })
  order: number

  @Column({
    type: 'enum',
    enum: ToursPageCategoryItemType,
    enumName: 'tours_page_category_item_type_enum',
  })
  type: ToursPageCategoryItemType

  @ManyToOne(() => ToursPage, (page) => page.category_items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tours_page_id' })
  tours_page: ToursPage

  @Column({ nullable: true })
  category_id: number | null

  @ManyToOne(() => Category, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category | null

  @Column({ nullable: true })
  seo_filter_id: number | null

  @ManyToOne(() => SeoFilter, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seo_filter_id' })
  seo_filter: SeoFilter | null
}
