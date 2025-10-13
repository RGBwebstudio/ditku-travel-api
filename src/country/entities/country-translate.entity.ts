import { LANG } from 'src/common/enums/translation.enum'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Country } from './country.entity'

@Entity()
export class CountryTranslate {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  custom_id: string

  @Column()
  field: string

  @Column()
  value: string

  @Column({ type: 'enum', enum: LANG })
  lang: LANG

  @ManyToOne(() => Country, (country) => country.translates, {
    onDelete: 'CASCADE'
  })
  entity_id: Country
}
