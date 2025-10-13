import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Category } from './category.entity'

@Entity()
export class CategoryImage {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  custom_id: string

  @Column()
  name: string

  @Column()
  path: string

  @ManyToOne(() => Category, (category: Category) => category.images, {
    onDelete: 'CASCADE'
  })
  entity_id: Category
}
