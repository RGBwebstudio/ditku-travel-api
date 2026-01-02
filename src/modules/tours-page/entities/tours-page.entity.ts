import { LANG } from 'src/common/enums/translation.enum'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { ToursPageStructureDto } from '../dto/tours-page-structure.dto'

@Entity()
export class ToursPage {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'jsonb', default: {} })
  structure: ToursPageStructureDto

  @Column({ enum: LANG, default: LANG.UA, unique: true })
  lang: LANG

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
