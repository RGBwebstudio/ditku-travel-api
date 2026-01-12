import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { FaqTranslate } from './faq-translate.entity'

@Entity()
export class Faq {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: false })
  show_in_product: boolean

  @Column({ nullable: true })
  title: string

  @Column({ nullable: true })
  text: string

  @Column({ type: 'text', nullable: true })
  title_ua: string

  @Column({ type: 'text', nullable: true })
  title_en: string

  @Column({ type: 'text', nullable: true })
  text_ua: string

  @Column({ type: 'text', nullable: true })
  text_en: string

  @OneToMany(() => FaqTranslate, (translates) => translates.entity_id)
  translates: FaqTranslate[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
