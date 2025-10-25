import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { CountryTranslate } from './country-translate.entity'
import { City } from 'src/city/entities/city.entity'

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  custom_id: string

  @Column()
  title: string

  @Column({ default: 0 })
  order_in_list: number

  @OneToMany(
    () => CountryTranslate,
    (translate: CountryTranslate) => translate.entity_id
  )
  translates: CountryTranslate[]

  @OneToMany(() => City, (city) => city.country_id)
  cities: City[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date

  brands_count?: number
}
