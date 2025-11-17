import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { LANG } from 'src/common/enums/translation.enum'

export enum TypeLabels {
  text_block = 'text_block',
  plates = 'plates',
  blog_list = 'blog_list',
  ready = 'ready',
  testimonials = 'testimonials',
  form = 'form',
  in_numbers = 'in_numbers',
  planning = 'planning'
}

export enum PageType {
  FOR_PARENT = 'for-parent',
  FOR_TEACHERS = 'for-teachers'
}

@Entity({ name: 'page_constructor' })
export class PageConstructor {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'jsonb', default: '{}' })
  structure: string

  @Column({ enum: LANG, default: LANG.UA })
  lang: LANG

  @Column({ enum: TypeLabels, nullable: true })
  content_type: TypeLabels

  @Column({ enum: PageType, nullable: true })
  page_type: PageType

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
