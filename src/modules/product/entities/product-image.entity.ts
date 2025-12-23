import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Product } from './product.entity'

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  path: string

  @Column({ default: 0 })
  order: number

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  entity_id: Product
}
