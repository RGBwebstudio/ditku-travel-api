import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Product } from './product.entity'
import { LANG } from '../../../common/enums/translation.enum'

@Entity()
export class ProductTranslate {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  field: string

  @Column()
  value: string

  @Column({ type: 'enum', enum: LANG })
  lang: LANG

  @ManyToOne(() => Product, (product) => product.translates, {
    onDelete: 'CASCADE',
  })
  entity_id: Product
}
