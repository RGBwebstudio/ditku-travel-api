import { Product } from 'src/product/entities/product.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Order } from './order.entity'

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  custom_id: string

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
  amount: string

  @Column({ type: 'jsonb' })
  measurement: string

  @ManyToOne(() => Product, (product) => product.order_item_ids)
  product_id: Product

  @ManyToOne(() => Order, (order) => order.products, { onDelete: 'CASCADE' })
  order_id: Order

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: string

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
