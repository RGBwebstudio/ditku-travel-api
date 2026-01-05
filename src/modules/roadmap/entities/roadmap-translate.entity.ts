import { LANG } from 'src/common/enums/translation.enum'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Roadmap } from './roadmap.entity'

@Entity()
export class RoadmapTranslate {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  field: string

  @Column()
  value: string

  @Column({ type: 'enum', enum: LANG })
  lang: LANG

  @ManyToOne(() => Roadmap, (roadmap) => roadmap.translates, {
    onDelete: 'CASCADE',
  })
  entity_id: Roadmap
}
