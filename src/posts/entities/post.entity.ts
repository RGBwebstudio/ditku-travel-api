import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from 'typeorm'
import { Category } from 'src/category/entities/category.entity'
import { PostTranslate } from './post-translate.entity'
import { PostImage } from './post-image.entity'

@Entity()
@Index(['category_id', 'is_top_main', 'created_at'])
@Index(['is_top_main', 'created_at'])
@Index(['is_top_side', 'created_at'])
@Index(['category_id'])
@Index(['url'])
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  custom_id: string

  @Column({ default: false })
  is_hidden: boolean

  @Column({ default: false })
  is_top_main: boolean

  @Column({ default: false })
  is_top_side: boolean

  @Column({ nullable: true })
  badge_text: string

  @Column()
  title: string

  @Column({ unique: true })
  url: string

  @Column({ nullable: true })
  seo_title: string

  @Column({ type: 'text', nullable: true })
  seo_description: string

  @Column({ type: 'smallint', default: 0 })
  order_in_category: number

  @Column({ type: 'smallint', default: 0 })
  order_in_product: number

  @ManyToOne(() => Category, (category: Category) => category.id, {
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'category_id' })
  category_id: Category

  @OneToMany(
    () => PostTranslate,
    (translate: PostTranslate) => translate.entity_id
  )
  translates: PostTranslate[]

  @OneToMany(() => PostImage, (image: PostImage) => image.entity_id)
  images: PostImage[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
