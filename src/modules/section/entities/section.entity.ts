import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable
} from 'typeorm'
import { SectionTranslate } from './section-translate.entity'
import { Product } from 'src/modules/product/entities/product.entity'
import { SeoFilter } from 'src/modules/seo-filter/entities/seo-filter.entity'

@Entity()
export class Section {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @ManyToMany(() => Product, (product) => product.sections, {
    onDelete: 'CASCADE'
  })
  @JoinTable({
    name: 'product_section',
    joinColumn: { name: 'section_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' }
  })
  products: Product[]

  @ManyToMany(() => SeoFilter, (seoFilter) => seoFilter.sections)
  seo_filters: SeoFilter[]

  @OneToMany(() => SectionTranslate, (translate) => translate.entity_id)
  translates: SectionTranslate[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
