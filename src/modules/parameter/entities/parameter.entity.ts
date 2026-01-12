import { Exclude } from 'class-transformer'
import { ParameterCategory } from 'src/modules/parameter-category/entities/parameter-category.entity'
import { Product } from 'src/modules/product/entities/product.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  OneToMany,
} from 'typeorm'

import { ParameterTranslate } from './category-translate.entity'

@Entity()
export class Parameter {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  title: string

  @ManyToMany(() => ParameterCategory, (parameterCategory) => parameterCategory.parameters, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'parameter_categories',
    joinColumn: { name: 'parameter_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'parameter_category_id',
      referencedColumnName: 'id',
    },
  })
  category_ids: ParameterCategory[]

  @Column({ default: 0 })
  order_in_list: number

  @Exclude()
  @ManyToMany(() => Product, (product) => product.parameters, {
    onDelete: 'CASCADE',
  })
  products: Product[]

  @OneToMany(() => ParameterTranslate, (translate) => translate.entity_id)
  translates: ParameterTranslate[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date

  products_count?: number
}
