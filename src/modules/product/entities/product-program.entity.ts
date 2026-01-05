import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm'

import { Product } from './product.entity'
import { ProductProgramImage } from './product-program-image.entity'
import { ProductProgramTranslate } from './product-program-translate.entity'

@Entity()
export class ProductProgram {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  day: number

  @Column({ type: 'varchar', length: 255, default: '' })
  title: string

  @Column({ type: 'text', default: '' })
  description: string

  @Column({ name: 'order_in_list', default: 0 })
  order: number

  @ManyToOne(() => Product, (product) => product.programs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product_id: Product

  @OneToMany(() => ProductProgramImage, (image) => image.program_id)
  images: ProductProgramImage[]

  @OneToMany(() => ProductProgramTranslate, (translate) => translate.entity_id)
  translates: ProductProgramTranslate[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}

