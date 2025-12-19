import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('seo_blocks')
export class SeoBlock {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  key: string

  @Column({ nullable: true })
  meta_title: string

  @Column({ nullable: true, type: 'text' })
  meta_description: string

  @Column({ nullable: true, type: 'text' })
  seo_text: string
}
