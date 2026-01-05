import { LANG } from 'src/common/enums/translation.enum'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Post } from './post.entity'

@Entity()
export class PostTranslate {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  field: string

  @Column()
  value: string

  @Column({ type: 'enum', enum: LANG })
  lang: LANG

  @ManyToOne(() => Post, (post: Post): PostTranslate[] => post.translates, {
    onDelete: 'CASCADE',
  })
  entity_id: Post
}
