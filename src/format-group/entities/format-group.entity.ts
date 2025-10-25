import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { Product } from 'src/product/entities/product.entity'

@Entity()
export class FormatGroup {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  value: string

  @ManyToMany(() => Product, (product) => product.format_groups)
  products: Product[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
