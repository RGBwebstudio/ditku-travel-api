import { LANG } from 'src/common/enums/translation.enum'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'

import { Product } from '../../product/entities/product.entity'
import { ToursPageStructureDto } from '../dto/tours-page-structure.dto'

@Entity()
export class ToursPage {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'jsonb', default: {} })
  structure: ToursPageStructureDto

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'tours_page_popular_tours',
    joinColumn: { name: 'tours_page_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  popular_tours: Product[]

  @Column({ enum: LANG, default: LANG.UA, unique: true })
  lang: LANG

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
