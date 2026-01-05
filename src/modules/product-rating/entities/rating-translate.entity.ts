import { LANG } from 'src/common/enums/translation.enum'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Rating } from './rating.entity'

@Entity()
export class RatingTranslate {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  field: string

  @Column()
  value: string

  @Column({ type: 'enum', enum: LANG })
  lang: LANG

  @ManyToOne(() => Rating, (rating) => rating.translates, {
    onDelete: 'CASCADE',
  })
  entity_id: Rating
}
