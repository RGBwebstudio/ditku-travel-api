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
import { Product } from '../../product/entities/product.entity'
import { SeoFilter } from '../../seo-filter/entities/seo-filter.entity'
import { ToursPageStructureDto } from '../dto/tours-page-structure.dto'

@Entity()
export class ToursPage {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'jsonb', default: {} })
  structure: ToursPageStructureDto

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'tours_page_popular_tours',
    joinColumn: { name: 'tours_page_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  popular_tours: Product[]

  @ManyToMany(() => SeoFilter)
  @JoinTable({
    name: 'tours_page_navigator_subcategories',
    joinColumn: { name: 'tours_page_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'seo_filter_id', referencedColumnName: 'id' },
  })
  navigator_subcategories: SeoFilter[]

  @ManyToMany(() => Post)
  @JoinTable({
    name: 'tours_page_recommended_posts',
    joinColumn: { name: 'tours_page_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'post_id', referencedColumnName: 'id' },
  })
  recommended_posts: Post[]

  @Column({ enum: LANG, default: LANG.UA, unique: true })
  lang: LANG

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
