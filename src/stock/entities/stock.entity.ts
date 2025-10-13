import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Index
} from 'typeorm'
import { Product } from 'src/product/entities/product.entity'

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @Column({ nullable: true })
  custom_id: string

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  amount: string

  @Index()
  @OneToOne(() => Product, (product) => product.stock, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'product_stock' })
  product: Product

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
