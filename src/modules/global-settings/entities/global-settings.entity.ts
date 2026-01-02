import { LANG } from 'src/common/enums/translation.enum'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class GlobalSettings {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'jsonb', default: '{}' })
  structure: string

  @Column({ default: '' })
  cta_title: string

  @Column({ default: '' })
  cta_subtitle: string

  @Column({ default: '' })
  cta_text: string

  @Column({ default: 'Learn More' })
  cta_button_text: string

  @Column({ default: '' })
  cta_link: string

  @Column({ nullable: true })
  cta_image: string

  @Column({ enum: LANG, default: LANG.UA })
  lang: LANG

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
