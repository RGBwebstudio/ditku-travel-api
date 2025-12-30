import { Product } from 'src/modules/product/entities/product.entity'
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm'

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
