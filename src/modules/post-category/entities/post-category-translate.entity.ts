import { LANG } from 'src/common/enums/translation.enum'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { PostCategory } from './post-category.entity'

@Entity()
export class PostCategoryTranslate {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  field: string

  @Column()
  value: string

  @Column({ type: 'enum', enum: LANG })
  lang: LANG

  @ManyToOne(() => PostCategory, (entity: PostCategory) => entity.translates, {
    onDelete: 'CASCADE',
  })
  entity_id: PostCategory
}
