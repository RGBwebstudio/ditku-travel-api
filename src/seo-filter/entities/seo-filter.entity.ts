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
  TreeParent
} from 'typeorm'
import { Category } from 'src/category/entities/category.entity'
import { City } from 'src/city/entities/city.entity'
import { Country } from 'src/country/entities/country.entity'
import { Section } from 'src/section/entities/section.entity'
import { Menu } from 'src/menu/entities/menu.entity'

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

  @ManyToOne(() => Category, (category) => category.id, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'category_id' })
  category_id: Category

  @ManyToOne(() => City, (city) => city.id, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'city_id' })
  city_id: City

  @ManyToOne(() => Country, (country) => country.id, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'country_id' })
  country_id: Country

  @ManyToMany(() => Section, (section) => section.seo_filters, {
    onDelete: 'CASCADE'
  })
  @JoinTable({
    name: 'seo_filter_section',
    joinColumn: { name: 'seo_filter_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'section_id', referencedColumnName: 'id' }
  })
  sections: Section[]

  @ManyToMany(() => Menu, (menu) => menu.seo_filters)
  menus: Menu[]

  @TreeParent()
  parent?: SeoFilter

  @TreeChildren()
  children?: SeoFilter[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
