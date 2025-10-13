import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Discount {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', nullable: true })
  custom_id: string

  @Column({ type: 'varchar', nullable: true })
  @Column({
    type: 'varchar',
    nullable: true,
    name: 'custom_discount_condition_id'
  })
  custom_discount_condition_id: string

  @Column({ type: 'varchar', nullable: true })
  title: string | null

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
