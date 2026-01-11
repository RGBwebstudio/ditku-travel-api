import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'

import { Post } from './post.entity'

export enum SocialType {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  TELEGRAM = 'telegram',
}

@Entity()
export class PostSocial {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'enum',
    enum: SocialType,
  })
  type: SocialType

  @Column()
  url: string

  @ManyToOne(() => Post, (post) => post.socials, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post
}
