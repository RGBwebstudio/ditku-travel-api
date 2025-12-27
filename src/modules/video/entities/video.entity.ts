import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm'

import { VideoCategory } from './video-category.entity'

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => VideoCategory, (cat) => cat.videos, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category_id: VideoCategory | null

  @Column()
  youtube_link: string

  @Column({ nullable: true })
  thumbnail: string

  @Column({ default: 0 })
  order: number

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
