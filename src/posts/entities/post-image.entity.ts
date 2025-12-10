import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Post } from './post.entity'

@Entity()
export class PostImage {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string

  @Column()
  path: string

  @Column({ default: 0 })
  order: number

  @ManyToOne(() => Post, (post) => post.images, {
    onDelete: 'CASCADE'
  })
  entity_id: Post
}
