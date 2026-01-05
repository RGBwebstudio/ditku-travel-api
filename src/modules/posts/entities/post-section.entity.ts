import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PostSectionImage } from './post-section-image.entity'
import { PostSectionTranslate } from './post-section-translate.entity'
import { Post } from './post.entity'

@Entity()
export class PostSection {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Post, (post: Post): PostSection[] => post.sections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post

  @Column({ type: 'int', default: 0 })
  order: number

  @OneToMany(() => PostSectionTranslate, (translate: PostSectionTranslate): PostSection => translate.section_id, {
    cascade: true,
  })
  translates: PostSectionTranslate[]

  @OneToMany(() => PostSectionImage, (image: PostSectionImage): PostSection => image.section_id, {
    cascade: true,
  })
  images: PostSectionImage[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
