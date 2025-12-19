import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { Video } from './video.entity'

@Entity()
export class VideoCategory {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  title: string

  @OneToMany(() => Video, (video) => video.category_id)
  videos: Video[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
