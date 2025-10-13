import { LANG } from 'src/common/enums/translation.enum'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from './product.entity'

@Entity()
export class ProductTranslate {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  custom_id: string

  @Column()
  field: string

  @Column()
  value: string

  @Column({ type: 'enum', enum: LANG })
  lang: LANG

  @ManyToOne(() => Product, (product) => product.translates, {
    onDelete: 'CASCADE'
  })
  entity_id: Product
}
