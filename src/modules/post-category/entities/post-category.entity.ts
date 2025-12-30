import { Post } from 'src/modules/posts/entities/post.entity'
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'

import { PostCategoryTranslate } from './post-category-translate.entity'

@Entity()
@Index(['title'])
export class PostCategory {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  title: string

  @OneToMany(() => PostCategoryTranslate, (t) => t.entity_id)
  translates: PostCategoryTranslate[]

  @OneToMany(() => Post, (post) => post.category_id)
  posts: Post[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
