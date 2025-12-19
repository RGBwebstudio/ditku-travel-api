import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { LANG } from 'src/common/enums/translation.enum'

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

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
