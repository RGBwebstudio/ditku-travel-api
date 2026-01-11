import { LANG } from 'src/common/enums/translation.enum'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class PrivacyPolicy {
  @PrimaryGeneratedColumn()
  id: number
  @Column({ type: 'jsonb', default: '{}' })
  structure: any

  @Column({ enum: LANG, default: LANG.UA })
  lang: LANG

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
