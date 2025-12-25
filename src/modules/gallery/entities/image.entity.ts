import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ImageCategory } from './image-category.entity'

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  @Index()
  categoryId: number | null

  @ManyToOne(() => ImageCategory, (category) => category.images, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  category: ImageCategory | null

  @Column()
  originalName: string

  @Column({ type: 'varchar', nullable: true })
  path_lg: string | null

  @Column({ type: 'varchar', nullable: true })
  path_md: string | null

  @Column({ type: 'varchar', nullable: true })
  path_sm: string | null

  @Column({ default: 'image/avif' })
  contentType: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
