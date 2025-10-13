import {
  Column,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  Entity,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { Cart } from './cart.entity'
import { DeliveryType } from 'src/common/enums/cart.enum'

@Entity()
export class CartDetails {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => Cart, (cart) => cart.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart_id: Cart

  @Column({ nullable: true })
  coords: string

  @Column({
    enum: DeliveryType,
    default: DeliveryType.ADDRESS
  })
  delivery_type: DeliveryType

  @Column({ type: 'jsonb' })
  meta_data: string

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
