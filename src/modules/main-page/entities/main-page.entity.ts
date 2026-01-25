import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'

import { LANG } from '../../../common/enums/translation.enum'
import { Post } from '../../posts/entities/post.entity'
import { MainPageStructureDto } from '../dto/main-page-structure.dto'

@Entity()
export class MainPage {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'jsonb', default: {} })
  structure: MainPageStructureDto

  @Column({ enum: LANG, default: LANG.UA })
  lang: LANG

  @ManyToMany(() => Post)
  @JoinTable({
    name: 'main_page_recommended_posts',
    joinColumn: { name: 'main_page_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'post_id', referencedColumnName: 'id' },
  })
  recommended_posts: Post[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
