import { User } from 'src/user/entities/user.entity'
import {
  Column,
  JoinColumn,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany
} from 'typeorm'
import { OrderStatus } from 'src/common/enums/order.enum'
import { OrderDetails } from './order-details.entity'
import { OrderItem } from './order-item.entity'

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  custom_id: string

  @ManyToOne(() => User, (user) => user.order_ids, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user_id: User | null

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.NEW
  })
  status: OrderStatus

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total: string

  @OneToOne(() => OrderDetails, (details) => details.order_id, {
    onDelete: 'CASCADE'
  })
  details: OrderDetails

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order_id, {
    onDelete: 'CASCADE'
  })
  products: OrderItem[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
