import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { BannerGroup } from './banners.entity'

@Entity()
export class BannerImage {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  name: string

  @Column({ nullable: true })
  link: string

  @Column()
  path: string

  @Column({ nullable: true })
  path_md: string

  @Column({ nullable: true })
  path_sm: string

  @Column({ default: 0 })
  order: number

  @ManyToOne(() => BannerGroup, (banner) => banner.images, {
    onDelete: 'CASCADE',
  })
  entity_id: BannerGroup
}
