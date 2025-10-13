import { Product } from 'src/product/entities/product.entity'
import {
  Entity,
  JoinColumn,
  ManyToOne,
  Column,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Cart } from './cart.entity'
import { IsOptional } from 'class-validator'

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  @IsOptional()
  custom_id: string

  @ManyToOne(() => Product, (product) => product.cart_item_id, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'product_id' })
  product_id: Product

  @Column({ type: 'bigint', nullable: true })
  parent_bundle_id: number

  @Column({ type: 'bigint', nullable: true })
  bundle_id: number

  @Column({ type: 'decimal', precision: 10, scale: 3, default: 1 })
  amount: string

  @Column({ default: '' })
  comment: string

  @ManyToOne(() => Cart, (cart) => cart.cart_items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart_id: Cart
}
