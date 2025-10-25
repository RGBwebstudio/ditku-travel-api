import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm'
import { Country } from 'src/country/entities/country.entity'
import { Roadmap } from 'src/roadmap/entities/roadmap.entity'

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: false })
  is_hidden: boolean

  @Column()
  title: string

  @Column()
  url: string

  @Column({ nullable: true })
  seo_title: string

  @Column({ nullable: true })
  seo_description: string

  @Column({ default: 0 })
  order: number

  @ManyToOne(() => Country, (country) => country.cities, {
    nullable: true,
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'country_id' })
  country_id: Country

  @OneToMany(() => Roadmap, (roadmap) => roadmap.city_id)
  roadmaps: Roadmap[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
