import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Category } from './category.entity'
import { SeoFilter } from '../../seo-filter/entities/seo-filter.entity'
import { ToursPageCategoryItemType } from '../../tours-page/enums/tours-page-category-item-type.enum'

@Entity()
export class CategoryCategoryItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int' })
  order: number

  @Column({
    type: 'enum',
    enum: ToursPageCategoryItemType,
  })
  type: ToursPageCategoryItemType

  @ManyToOne(() => Category, (cat) => cat.category_items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_owner_id' })
  category_owner: Category

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
