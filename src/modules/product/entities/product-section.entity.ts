import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm'

import { ProductSectionTranslate } from './product-section-translate.entity'
import { Product } from './product.entity'

@Entity('product_content_section')
export class ProductSection {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 50, default: 'content' })
  type: string // 'content' | 'banners' | 'quote'

  @Column({ name: 'order_in_list', default: 0 })
  order: number

  @Column({ type: 'varchar', length: 255, default: '' })
  title: string

  @Column({ type: 'text', default: '' })
  description: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  badge: string

  @Column({ type: 'jsonb', nullable: true, default: [] })
  images: string[]

  @Column({ type: 'varchar', length: 255, nullable: true })
  banner1_title: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  banner1_button_text: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  banner1_link: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  banner2_title: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  banner2_button_text: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  banner2_link: string

  @ManyToOne(() => Product, (product) => product.productSections, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product_id: Product

  @OneToMany(() => ProductSectionTranslate, (translate) => translate.entity_id)
  translates: ProductSectionTranslate[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
