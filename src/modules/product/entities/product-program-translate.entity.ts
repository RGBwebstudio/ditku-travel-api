import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { ProductProgram } from './product-program.entity'
import { LANG } from '../../../common/enums/translation.enum'

@Entity()
export class ProductProgramTranslate {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  field: string

  @Column({ type: 'text' })
  value: string

  @Column({ type: 'enum', enum: LANG })
  lang: LANG

  @ManyToOne(() => ProductProgram, (program) => program.translates, {
    onDelete: 'CASCADE',
  })
  entity_id: ProductProgram
}
