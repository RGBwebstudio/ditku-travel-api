import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'

import { PostSection } from './post-section.entity'

@Entity()
export class PostSectionImage {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => PostSection, (section: PostSection): PostSectionImage[] => section.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'section_id' })
  section_id: PostSection

  @Column()
  url: string
}
