import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { FaqTranslate } from './faq-translate.entity'

@Entity()
export class Faq {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  show_in_product: boolean

  @Column()
  title: string

  @Column()
  text: string

  @OneToMany(() => FaqTranslate, (translates) => translates.entity_id)
  translates: FaqTranslate[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
