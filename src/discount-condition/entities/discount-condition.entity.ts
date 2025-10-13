import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class DiscountCondition {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', nullable: true })
  custom_id: string | null

  @Column({ type: 'varchar', nullable: true })
  title: string | null

  @Column({ type: 'varchar', nullable: true })
  condition_type: string | null

  @Column({ type: 'varchar', nullable: true })
  condition_criteria: string | null

  @Column({ type: 'varchar', nullable: true })
  condition_value: string | null

  @Column({ type: 'varchar', nullable: true })
  condition_comparison: string | null

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
