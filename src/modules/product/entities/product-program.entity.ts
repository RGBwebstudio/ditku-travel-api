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

import { ProductProgramImage } from './product-program-image.entity'
import { ProductProgramTranslate } from './product-program-translate.entity'
import { Product } from './product.entity'

export enum ProductProgramType {
  Day = 'day',
  Banners = 'banners',
}

@Entity()
export class ProductProgram {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', default: '' })
  badge: string

  @Column({
    type: 'enum',
    enum: ProductProgramType,
    default: ProductProgramType.Day,
  })
  type: ProductProgramType

  @Column({ type: 'varchar', length: 255, default: '' })
  title: string

  @Column({ type: 'text', default: '' })
  description: string

  @Column({ type: 'varchar', nullable: true })
  banner1_title_ua: string

  @Column({ type: 'varchar', nullable: true })
  banner1_title_en: string

  @Column({ type: 'varchar', nullable: true })
  banner1_button_text_ua: string

  @Column({ type: 'varchar', nullable: true })
  banner1_button_text_en: string

  @Column({ type: 'varchar', nullable: true })
  banner1_link_ua: string

  @Column({ type: 'varchar', nullable: true })
  banner1_link_en: string

  @Column({ type: 'varchar', nullable: true })
  banner2_title_ua: string

  @Column({ type: 'varchar', nullable: true })
  banner2_title_en: string

  @Column({ type: 'varchar', nullable: true })
  banner2_button_text_ua: string

  @Column({ type: 'varchar', nullable: true })
  banner2_button_text_en: string

  @Column({ type: 'varchar', nullable: true })
  banner2_link_ua: string

  @Column({ type: 'varchar', nullable: true })
  banner2_link_en: string

  @Column({ name: 'order_in_list', default: 0 })
  order: number

  @ManyToOne(() => Product, (product) => product.programs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product_id: Product

  @OneToMany(() => ProductProgramImage, (image) => image.program_id)
  images: ProductProgramImage[]

  @OneToMany(() => ProductProgramTranslate, (translate) => translate.entity_id)
  translates: ProductProgramTranslate[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
