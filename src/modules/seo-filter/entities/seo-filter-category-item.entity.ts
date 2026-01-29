import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { SeoFilter } from './seo-filter.entity'
import { Category } from '../../category/entities/category.entity'
import { ToursPageCategoryItemType } from '../../tours-page/enums/tours-page-category-item-type.enum'

@Entity()
export class SeoFilterCategoryItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int' })
  order: number

  @Column({
    type: 'enum',
    enum: ToursPageCategoryItemType,
  })
  type: ToursPageCategoryItemType

  @ManyToOne(() => SeoFilter, (sf) => sf.category_items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'seo_filter_owner_id' })
  seo_filter_owner: SeoFilter

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
