import { LANG } from 'src/common/enums/translation.enum'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { DAP } from './dap.entity'

@Entity()
export class DAPTranslates {
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

  @ManyToOne(() => DAP, (entity) => entity.translates, {
    onDelete: 'CASCADE'
  })
  entity_id: DAP
}
