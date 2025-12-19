import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm'
import { Product } from 'src/modules/product/entities/product.entity'
import { City } from 'src/modules/city/entities/city.entity'

@Entity()
export class Roadmap {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  start_point: boolean

  @Column()
  end_point: boolean

  @ManyToOne(() => Product, { onDelete: 'SET NULL' })
  product_id: Product | null

  @ManyToOne(() => City, (city) => city.roadmaps, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'city_id' })
  city_id: City | null

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
