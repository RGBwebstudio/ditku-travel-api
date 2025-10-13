import { LANG } from 'src/common/enums/translation.enum'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Parameter } from './parameter.entity'

@Entity()
export class ParameterTranslate {
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

  @ManyToOne(() => Parameter, (parameter: Parameter) => parameter.translates, {
    onDelete: 'CASCADE'
  })
  entity_id: Parameter
}
