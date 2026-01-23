import { Category } from 'src/modules/category/entities/category.entity'
import { PageConstructor } from 'src/modules/page-constructor/entities/page-constructor.entity'
import { PageConstructorCategory } from 'src/modules/page-constructor-category/entities/page-constructor-category.entity'
import { SeoFilter } from 'src/modules/seo-filter/entities/seo-filter.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum MenuType {
  TOURS = 'for-tours',
  FOR_PARENTS = 'for-parents',
  FOR_TEACHERS = 'for-teachers',
}

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ enum: MenuType, default: MenuType.TOURS })
  type: MenuType

  @ManyToOne(() => Category, (category) => category.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category_id: Category | null

  @ManyToOne(() => PageConstructorCategory, (pageConstructorCategory) => pageConstructorCategory.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'page_constructor_category_id' })
  page_constructor_category_id: PageConstructorCategory | null

  @ManyToMany(() => SeoFilter, (seoFilter) => seoFilter.menus, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'menu_seo_filter',
    joinColumn: { name: 'menu_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'seo_filter_id', referencedColumnName: 'id' },
  })
  seo_filters: SeoFilter[]

  @ManyToMany(() => PageConstructor, (page) => page.id, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'menu_page_constructor',
    joinColumn: { name: 'menu_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'page_constructor_id', referencedColumnName: 'id' },
  })
  page_constructors: PageConstructor[]

  @Column({ default: 0 })
  order_in_list: number

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
