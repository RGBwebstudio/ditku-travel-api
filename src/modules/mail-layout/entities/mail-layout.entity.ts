import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class MailLayout {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  subject: string

  @Column()
  content: string

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
