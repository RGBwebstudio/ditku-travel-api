import { LANG } from 'src/common/enums/translation.enum'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { ProductSection } from './product-section.entity'

@Entity('product_content_section_translate')
export class ProductSectionTranslate {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  field: string

  @Column({ type: 'text' })
  value: string

  @Column({ type: 'enum', enum: LANG })
  lang: LANG

  @ManyToOne(() => ProductSection, (section: ProductSection) => section.translates, {
    onDelete: 'CASCADE',
  })
  entity_id: ProductSection
}
