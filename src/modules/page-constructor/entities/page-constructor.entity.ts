import { LANG } from 'src/common/enums/translation.enum'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

import { PageConstructorCategory } from '../../page-constructor-category/entities/page-constructor-category.entity'

export enum PageType {
  FOR_PARENT = 'for-parent',
  FOR_TEACHERS = 'for-teachers',
}

@Entity({ name: 'page_constructor' })
export class PageConstructor {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'jsonb', default: '{}' })
  structure: string

  @Column({ enum: LANG, default: LANG.UA })
  lang: LANG

  @Column()
  title: string

  @Column({ nullable: true })
  seo_title: string

  @Column({ type: 'text', nullable: true })
  seo_description: string

  @Column()
  url: string

  @Column({ type: 'int', default: 0 })
  order: number

  @Column({ enum: PageType, nullable: true })
  page_type: PageType

  @Column({ nullable: true })
  category_id: number

  @ManyToOne(() => PageConstructorCategory, (category) => category.pages, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: PageConstructorCategory

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
