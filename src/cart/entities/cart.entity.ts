import { User } from 'src/user/entities/user.entity'
import {
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne
} from 'typeorm'
import { CartItem } from './cart-item.entity'
import { CartDetails } from './cart-details.entity'

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  session_id: string

  @ManyToOne(() => User, (user) => user.cart_ids)
  user_id: User

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart_id)
  cart_items: CartItem[]

  @OneToOne(() => CartDetails, (details) => details.cart_id)
  details: CartDetails

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
