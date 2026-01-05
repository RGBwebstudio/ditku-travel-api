import { Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm'

import { VideoCategoryTranslate } from './video-category-translate.entity'
import { Video } from './video.entity'

@Entity()
export class VideoCategory {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  title: string

  @OneToMany(() => Video, (video) => video.category_id)
  videos: Video[]

  @OneToMany(() => VideoCategoryTranslate, (translate) => translate.entity_id)
  translates: VideoCategoryTranslate[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
