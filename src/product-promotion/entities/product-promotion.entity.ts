import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { ProductPromotionTranslate } from './product-promotion-translate.entity'
import { Product } from 'src/product/entities/product.entity'

@Entity()
export class ProductPromotion {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  custom_id: string

  @Column()
  show_on_main_page: boolean

  @Column()
  title: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  from_amount: string

  @Column()
  discount: number

  @Column()
  priority: number

  @OneToMany(
    () => ProductPromotionTranslate,
    (translate) => translate.entity_id
  )
  translates: ProductPromotionTranslate[]

  @OneToMany(() => Product, (product) => product.promotion_id)
  products: Product[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
