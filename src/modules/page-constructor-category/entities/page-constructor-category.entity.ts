import { ApiProperty } from '@nestjs/swagger'

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm'

import { PageType } from '../../page-constructor/entities/page-constructor.entity'
import { PageConstructor } from '../../page-constructor/entities/page-constructor.entity'

@Entity({ name: 'page_constructor_category' })
export class PageConstructorCategory {
  @ApiProperty({ example: 1, description: 'Унікальний ідентифікатор' })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ example: 'Категорія 1', description: 'Назва категорії (UA)' })
  @Column()
  title_ua: string

  @ApiProperty({
    example: 'Category 1',
    description: 'Назва категорії',
    required: false,
  })
  @Column({ nullable: true })
  title_en: string

  @ApiProperty({ enum: PageType, description: 'Тип сторінок (для батьків/вчителів)' })
  @Column({ enum: PageType })
  type: PageType

  @OneToMany(() => PageConstructor, (page) => page.category)
  pages: PageConstructor[]

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date
}
