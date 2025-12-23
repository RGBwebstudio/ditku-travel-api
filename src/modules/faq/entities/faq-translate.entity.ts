import { LANG } from 'src/common/enums/translation.enum'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Faq } from './faq.entity'

@Entity()
export class FaqTranslate {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  field: string

  @Column()
  value: string

  @Column({ type: 'enum', enum: LANG })
  lang: LANG

  @ManyToOne(() => Faq, (faq) => faq.translates, {
    onDelete: 'CASCADE',
  })
  entity_id: Faq
}
