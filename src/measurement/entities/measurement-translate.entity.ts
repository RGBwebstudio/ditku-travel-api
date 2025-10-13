import { LANG } from 'src/common/enums/translation.enum'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Measurement } from './measurement.entity'

@Entity()
export class MeasurementTranslate {
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

  @ManyToOne(() => Measurement, (measurement) => measurement.translates, {
    onDelete: 'CASCADE'
  })
  entity_id: Measurement
}
