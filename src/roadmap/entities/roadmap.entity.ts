import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm'
import { Product } from 'src/product/entities/product.entity'
import { City } from 'src/city/entities/city.entity'

@Entity()
export class Roadmap {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product_id: Product

  @ManyToOne(() => City, (city) => city.roadmaps, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'city_id' })
  city_id: City

  @Column()
  time: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ name: 'order', nullable: true })
  order: string

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
