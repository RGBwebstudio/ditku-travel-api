import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn
} from 'typeorm'
import { PaymentType } from 'src/common/enums/order.enum'
import { Order } from './order.entity'

@Entity()
export class OrderDetails {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  custom_id: string

  @Column()
  payment_type: PaymentType

  @Column()
  payment_id: string

  @Column()
  payment_link: string

  @Column({ type: 'timestamptz', nullable: true })
  payment_link_created_at: Date | null

  @Column()
  is_paid: boolean

  @Column()
  receipt_url: string

  @Column({ type: 'jsonb' })
  meta_data: string

  @OneToOne(() => Order, (order) => order.details, { onDelete: 'CASCADE' })
  @JoinColumn()
  order_id: Order

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
