import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  OneToMany
} from 'typeorm'
import { ParameterCategory } from 'src/parameter-category/entities/parameter-category.entity'
import { Product } from 'src/product/entities/product.entity'
import { ParameterTranslate } from './category-translate.entity'

@Entity()
export class Parameter {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  custom_id: string

  @Column()
  title: string

  @ManyToMany(
    () => ParameterCategory,
    (parameterCategory) => parameterCategory.parameters,
    { onDelete: 'CASCADE' }
  )
  @JoinTable({
    name: 'parameter_categories',
    joinColumn: { name: 'parameter_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'parameter_category_id',
      referencedColumnName: 'id'
    }
  })
  category_ids: ParameterCategory[]

  @Column({ default: 0 })
  order_in_list: number

  @ManyToMany(() => Product, (product) => product.parameters, {
    onDelete: 'CASCADE'
  })
  @JoinTable({
    name: 'product_and_parameter',
    joinColumn: { name: 'parameter_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id'
    }
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
