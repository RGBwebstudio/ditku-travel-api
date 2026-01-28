import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm'

import { ProductProgram } from './product-program.entity'

@Entity()
export class ProductProgramImage {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 500, nullable: true })
  url: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  path: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  path_md: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  path_sm: string

  @Column({ name: 'order_in_list', default: 0 })
  order: number

  @ManyToOne(() => ProductProgram, (program) => program.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'program_id' })
  program_id: ProductProgram
}
