import { Product } from 'src/modules/product/entities/product.entity'
import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm'

import { RatingTranslate } from './rating-translate.entity'

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5.0 })
  rating: string

  @Column({ type: 'text', nullable: true })
  review: string

  @Column({ type: 'varchar', nullable: false })
  name: string

  @Column({ type: 'boolean', default: false })
  approved: boolean

  @ManyToOne(() => Product, (product) => product.ratings, {
    onDelete: 'CASCADE',
  })
  product_id: Product

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date

  @OneToMany(() => RatingTranslate, (translate: RatingTranslate) => translate.entity_id)
  translates: RatingTranslate[]
}
