import { LANG } from 'src/common/enums/translation.enum'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'

import { PostSection } from './post-section.entity'

@Entity()
export class PostSectionTranslate {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => PostSection, (section: PostSection): PostSectionTranslate[] => section.translates, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'section_id' })
  section_id: PostSection

  @Column()
  field: string

  @Column({ type: 'text' })
  value: string

  @Column({ type: 'enum', enum: LANG })
  lang: LANG
}
