import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Image } from './image.entity'

@Entity('image_categories')
export class ImageCategory {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Index()
  name: string

  @Column({ nullable: true })
  @Index()
  parentId: number | null

  @ManyToOne(() => ImageCategory, (category) => category.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parentId' })
  parent: ImageCategory | null

  @OneToMany(() => ImageCategory, (category) => category.parent)
  children: ImageCategory[]

  @OneToMany(() => Image, (image) => image.category, {
    cascade: false,
  })
  images: Image[]

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
