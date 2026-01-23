import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { VideoCategory } from './video-category.entity'
import { LANG } from '../../../common/enums/translation.enum'

@Entity()
export class VideoCategoryTranslate {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  field: string

  @Column()
  value: string

  @Column({ type: 'enum', enum: LANG })
  lang: LANG

  @ManyToOne(() => VideoCategory, (category: VideoCategory) => category.translates, {
    onDelete: 'CASCADE',
  })
  entity_id: VideoCategory
}
