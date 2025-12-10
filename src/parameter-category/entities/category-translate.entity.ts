import { LANG } from 'src/common/enums/translation.enum'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ParameterCategory } from './parameter-category.entity'

@Entity()
export class ParameterCategoryTranslate {
  @PrimaryGeneratedColumn()
  id: number
  @Column()
  field: string

  @Column()
  value: string

  @Column({ type: 'enum', enum: LANG })
  lang: LANG

  @ManyToOne(
    () => ParameterCategory,
    (category: ParameterCategory) => category.translates,
    {
      onDelete: 'CASCADE'
    }
  )
  entity_id: ParameterCategory
}
