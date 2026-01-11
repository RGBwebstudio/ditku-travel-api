import { LANG } from 'src/common/enums/translation.enum'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import { FormatGroup } from './format-group.entity'

@Entity()
export class FormatGroupTranslate {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => FormatGroup, (formatGroup) => formatGroup.translates, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'format_group_id' })
  entity_id: FormatGroup

  @Column({ type: 'enum', enum: LANG })
  lang: LANG

  @Column({ type: 'enum', enum: ['title', 'subtitle'], default: 'title' })
  field: string

  @Column({ type: 'text' })
  value: string

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
