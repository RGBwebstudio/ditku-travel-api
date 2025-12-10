import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { Category } from 'src/category/entities/category.entity'
import { SeoFilter } from 'src/seo-filter/entities/seo-filter.entity'

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Category, (category) => category.id, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'category_id' })
  category_id: Category | null

  @ManyToMany(() => SeoFilter, (seoFilter) => seoFilter.menus, {
    onDelete: 'CASCADE'
  })
  @JoinTable({
    name: 'menu_seo_filter',
    joinColumn: { name: 'menu_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'seo_filter_id', referencedColumnName: 'id' }
  })
  seo_filters: SeoFilter[]

  @Column({ default: 0 })
  order_in_list: number

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
