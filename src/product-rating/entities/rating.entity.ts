import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm'
import { Product } from 'src/product/entities/product.entity'
import { User } from 'src/user/entities/user.entity'

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  custom_id: string

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5.0 })
  rating: string

  @Column({ type: 'text', nullable: true })
  review: string

  @ManyToOne(() => Product, (product) => product.ratings, {
    onDelete: 'CASCADE'
  })
  product_id: Product

  @ManyToOne(() => User, {
    onDelete: 'CASCADE'
  })
  user_id: User

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
