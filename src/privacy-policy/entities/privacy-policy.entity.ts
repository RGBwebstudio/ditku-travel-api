import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { LANG } from 'src/common/enums/translation.enum'

@Entity()
export class PrivacyPolicy {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  custom_id: string

  @Column({ type: 'jsonb', default: '{}' })
  structure: string

  @Column({ enum: LANG, default: LANG.UA })
  lang: LANG

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
