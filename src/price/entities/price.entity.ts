import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from 'typeorm'

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @Column({ nullable: true })
  custom_id: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  value: number

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
