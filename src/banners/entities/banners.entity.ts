import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { BannerImage } from './banner-image.entity'
import { BannerType } from 'src/common/types/banner-group.types'

@Entity()
export class BannerGroup {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  custom_id: string

  @Column()
  title: string

  @Column({ type: 'enum', enum: BannerType, default: BannerType.UNCATEGORIZED })
  type: BannerType

  @Column()
  order: number

  @OneToMany(() => BannerImage, (image) => image.entity_id, {
    onDelete: 'CASCADE'
  })
  images: BannerImage[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
