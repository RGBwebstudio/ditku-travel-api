import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm'
import { Product } from 'src/product/entities/product.entity'

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
    onDelete: 'CASCADE'
  })
  product_id: Product

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
