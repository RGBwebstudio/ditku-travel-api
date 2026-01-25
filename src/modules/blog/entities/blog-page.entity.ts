import { ApiProperty } from '@nestjs/swagger'

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

import { Post } from '../../posts/entities/post.entity'

@Entity()
export class BlogPage {
  @ApiProperty({ example: 1, description: 'ID' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ example: 'Блог', description: 'Заголовок сторінки блогу', required: false, nullable: true })
  @Column({ default: '', nullable: true })
  title_ua: string

  @Column({ default: '', nullable: true })
  title_en: string

  @Column({ default: '', nullable: true })
  meta_title_ua: string

  @Column({ default: '', nullable: true })
  meta_title_en: string

  @Column({ default: '', nullable: true })
  meta_description_ua: string

  @Column({ default: '', nullable: true })
  meta_description_en: string

  @ManyToOne(() => Post, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'top_post_id' })
  top_post: Post | null

  @ApiProperty({ type: () => [Post], description: 'Бокові пости', required: false })
  @ManyToMany(() => Post)
  @JoinTable({
    name: 'blog_page_side_posts',
    joinColumn: { name: 'blog_page_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'post_id', referencedColumnName: 'id' },
  })
  side_posts: Post[]

  @ApiProperty({ type: () => [Post], description: 'Рекомендовані пости', required: false })
  @ManyToMany(() => Post)
  @JoinTable({
    name: 'blog_page_recommended_posts',
    joinColumn: { name: 'blog_page_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'post_id', referencedColumnName: 'id' },
  })
  recommended_posts: Post[]

  @ApiProperty({ example: '2024-01-25T12:00:00Z', description: 'Дата оновлення' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
