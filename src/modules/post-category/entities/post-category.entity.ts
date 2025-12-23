import { Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'

import { PostCategoryTranslate } from './post-category-translate.entity'

@Entity()
@Index(['title'])
export class PostCategory {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  title: string

  @OneToMany(() => PostCategoryTranslate, (t) => t.entity_id)
  translates: PostCategoryTranslate[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
