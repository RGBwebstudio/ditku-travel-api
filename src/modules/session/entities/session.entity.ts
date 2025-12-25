import { Entity, Column, PrimaryColumn, Index } from 'typeorm'

@Entity('session')
export class Session {
  @PrimaryColumn({ collation: 'default' })
  sid: string

  @Column({ type: 'json' })
  sess: Record<string, any>

  @Index()
  @Column({ type: 'timestamp', precision: 6 })
  expire: Date
}
