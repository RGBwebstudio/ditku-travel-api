import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'

import { PostCategoryTranslate } from './post-category-translate.entity'
import { Post } from '../../posts/entities/post.entity'

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

  @ManyToOne(() => Post, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'top_post_id' })
  top_post: Post | null

  @ManyToMany(() => Post)
  @JoinTable({
    name: 'post_category_side_posts',
    joinColumn: { name: 'category_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'post_id', referencedColumnName: 'id' },
  })
  side_posts: Post[]

  @ManyToMany(() => Post)
  @JoinTable({
    name: 'post_category_recommended_posts',
    joinColumn: { name: 'category_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'post_id', referencedColumnName: 'id' },
  })
  recommended_posts: Post[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
