import { Exclude } from 'class-transformer'
import { Category } from 'src/modules/category/entities/category.entity'
import { City } from 'src/modules/city/entities/city.entity'
import { Country } from 'src/modules/country/entities/country.entity'
import { Menu } from 'src/modules/menu/entities/menu.entity'
import { Product } from 'src/modules/product/entities/product.entity'
import { Section } from 'src/modules/section/entities/section.entity'
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

import { SeoFilterTranslate } from './seo-filter-translate.entity'

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

  @ManyToMany(() => Section, (section) => section.seo_filters, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'seo_filter_section',
    joinColumn: { name: 'seo_filter_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'section_id', referencedColumnName: 'id' },
  })
  sections: Section[]

  @ManyToMany(() => Menu, (menu) => menu.seo_filters)
  menus: Menu[]

  @Exclude()
  @ManyToMany(() => Product, (product) => product.seo_filters)
  products: Product[]

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
}
