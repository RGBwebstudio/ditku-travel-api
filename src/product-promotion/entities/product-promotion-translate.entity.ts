import { LANG } from 'src/common/enums/translation.enum'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ProductPromotion } from './product-promotion.entity'

@Entity()
export class ProductPromotionTranslate {
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

  @ManyToOne(() => ProductPromotion, (promotion) => promotion.translates, {
    onDelete: 'CASCADE'
  })
  entity_id: ProductPromotion
}
