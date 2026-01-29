import { Exclude } from 'class-transformer'
import { Product } from 'src/modules/product/entities/product.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'

import { FormatGroupTranslate } from './format-group-translate.entity'

@Entity()
export class FormatGroup {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  value: string

  @Column({ nullable: true })
  subtitle: string

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: string

  @Exclude()
  @ManyToMany(() => Product, (product) => product.format_groups)
  products: Product[]

  @OneToMany(() => FormatGroupTranslate, (translate) => translate.entity_id)
  translates: FormatGroupTranslate[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
