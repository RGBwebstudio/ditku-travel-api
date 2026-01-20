import { LANG } from '../../../common/enums/translation.enum'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class Contacts {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'jsonb' })
  structure: string

  @Column({ enum: LANG, default: LANG.UA })
  lang: LANG

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
