import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToMany,
  JoinTable,
} from 'typeorm'

import { PostImage } from './post-image.entity'
import { PostSection } from './post-section.entity'
import { PostSocial } from './post-social.entity'
import { PostTranslate } from './post-translate.entity'
import { PostCategory } from '../../post-category/entities/post-category.entity'

@Entity()
@Index(['category_id'])
@Index(['url'])
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: false })
  is_hidden: boolean

  @Column({ nullable: true })
  badge_text: string

  @Column()
  title: string

  @Column({ unique: true })
  url: string

  @Column({ nullable: true })
  seo_title: string

  @Column({ type: 'text', nullable: true })
  seo_description: string

  @Column({ type: 'smallint', default: 0 })
  order_in_category: number

  @Column({ type: 'smallint', default: 0 })
  order_in_product: number

  @Column({ type: 'text', nullable: true })
  content: string

  @ManyToOne(() => PostCategory, (category: PostCategory) => category.posts, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category_id: PostCategory

  @OneToMany(() => PostTranslate, (translate: PostTranslate): Post => translate.entity_id)
  translates: PostTranslate[]

  @OneToMany(() => PostImage, (image: PostImage): Post => image.entity_id)
  images: PostImage[]

  @OneToMany(() => PostSection, (section: PostSection): Post => section.post, { cascade: true })
  sections: PostSection[]

  @OneToMany(() => PostSocial, (social: PostSocial) => social.post, { cascade: true })
  socials: PostSocial[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @ManyToMany(() => Post)
  @JoinTable({
    name: 'post_recommended_posts',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'recommended_post_id', referencedColumnName: 'id' },
  })
  recommended_posts: Post[]

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
