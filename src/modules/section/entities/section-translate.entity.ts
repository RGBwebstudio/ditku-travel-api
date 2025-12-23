import { LANG } from 'src/common/enums/translation.enum'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Section } from './section.entity'

@Entity()
export class SectionTranslate {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  field: string

  @Column()
  value: string

  @Column({ type: 'enum', enum: LANG })
  lang: LANG

  @ManyToOne(() => Section, (section: Section) => section.translates, {
    onDelete: 'CASCADE',
  })
  entity_id: Section
}
