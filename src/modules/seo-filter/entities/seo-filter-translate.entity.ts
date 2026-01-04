import { LANG } from 'src/common/enums/translation.enum'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { SeoFilter } from './seo-filter.entity'

@Entity()
export class SeoFilterTranslate {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  field: string

  @Column()
  value: string

  @Column({ type: 'enum', enum: LANG })
  lang: LANG

  @ManyToOne(() => SeoFilter, (seoFilter) => seoFilter.translates, {
    onDelete: 'CASCADE',
  })
  entity_id: SeoFilter
}
