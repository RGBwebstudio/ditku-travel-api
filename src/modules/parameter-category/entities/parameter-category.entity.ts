import { Parameter } from 'src/modules/parameter/entities/parameter.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm'

import { ParameterCategoryTranslate } from './category-translate.entity'

@Entity()
export class ParameterCategory {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  title: string

  @ManyToMany(() => Parameter, (parameter) => parameter.category_ids, {
    onDelete: 'RESTRICT',
  })
  parameters: Parameter[]

  @OneToMany(() => ParameterCategoryTranslate, (translate) => translate.entity_id)
  translates: ParameterCategoryTranslate[]

  @Column({ default: 0 })
  order_in_list: number

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
