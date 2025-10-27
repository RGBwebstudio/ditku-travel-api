import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Index
} from 'typeorm'
import { Category } from 'src/category/entities/category.entity'
import { CartItem } from 'src/cart/entities/cart-item.entity'
import { Parameter } from 'src/parameter/entities/parameter.entity'
import { FormatGroup } from 'src/format-group/entities/format-group.entity'
import { ProductTranslate } from './product-translate.entity'
import { ProductImage } from './product-image.entity'
import { Rating } from 'src/product-rating/entities/rating.entity'
import { Stock } from 'src/stock/entities/stock.entity'
import { Measurement } from 'src/measurement/entities/measurement.entity'
import { ProductPromotion } from 'src/product-promotion/entities/product-promotion.entity'
import { OrderItem } from 'src/order/entities/order-item.entity'
import { Section } from 'src/section/entities/section.entity'

@Entity()
@Index(['category_id', 'show_on_main_page', 'created_at'])
@Index(['show_on_main_page', 'created_at'])
@Index(['category_id'])
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @Column({ default: '', nullable: true })
  custom_id: string

  @Column()
  is_top: boolean

  @Column()
  is_hidden: boolean

  @Column()
  is_parent: boolean

  @Column()
  article: string

  @Column()
  title: string

  @Column()
  subtitle: string

  @Column()
  seo_title: string

  @Column({ type: 'text', default: '' })
  seo_description: string

  @Column()
  url: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: string

  @Column({ type: 'text' })
  discover: string

  @Column({ type: 'text' })
  skills: string

  @Column({ default: 0 })
  order_in_list: number

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  weight: string

  @Column({ default: false })
  show_on_main_page: boolean

  @Column({ default: 0 })
  popular_count: number

  @Column({ default: false })
  is_popular: boolean

  @OneToMany(() => CartItem, (cartItem: CartItem) => cartItem.product_id)
  cart_item_id: CartItem[]

  @ManyToOne(() => Product, (product: Product) => product.parent_id, {
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'parent_id' })
  parent_id: Product

  @ManyToOne(() => Category, (category: Category) => category.products, {
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'category_id' })
  category_id: Category

  @ManyToOne(
    () => Measurement,
    (measurement: Measurement) => measurement.products,
    {
      onDelete: 'RESTRICT'
    }
  )
  @JoinColumn({ name: 'measurement' })
  measurement_id: Measurement

  @ManyToOne(
    () => ProductPromotion,
    (promotion: ProductPromotion) => promotion.products,
    {
      onDelete: 'SET NULL'
    }
  )
  promotion_id: ProductPromotion

  @ManyToMany(() => Parameter, (parameter: Parameter) => parameter.products, {
    onDelete: 'CASCADE'
  })
  @JoinTable({
    name: 'product_parameters',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'parameter_id', referencedColumnName: 'id' }
  })
  parameters: Parameter[]

  @ManyToMany(
    () => FormatGroup,
    (formatGroup: FormatGroup) => formatGroup.products,
    {
      onDelete: 'CASCADE'
    }
  )
  @JoinTable({
    name: 'product_format_group',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'group_format_id', referencedColumnName: 'id' }
  })
  format_groups: FormatGroup[]

  @ManyToMany(() => Section, (section: Section) => section.products, {
    onDelete: 'CASCADE'
  })
  sections: Section[]

  @ManyToMany(() => Product, (product: Product) => product.recommendedBy, {
    onDelete: 'CASCADE'
  })
  @JoinTable({
    name: 'product_recommendations',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'recommended_product_id',
      referencedColumnName: 'id'
    }
  })
  recommendedProducts: Product[]

  @ManyToMany(() => Product, (product: Product) => product.recommendedProducts)
  recommendedBy: Product[]

  @OneToMany(
    () => ProductTranslate,
    (translate: ProductTranslate) => translate.entity_id
  )
  translates: ProductTranslate[]

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.product_id)
  order_item_ids: OrderItem[]

  @OneToMany(() => ProductImage, (image: ProductImage) => image.entity_id)
  images: ProductImage[]

  @OneToMany(() => Rating, (rating: Rating) => rating.product_id)
  ratings: Rating[]

  @OneToOne(() => Stock, (stock: Stock) => stock.product)
  stock: Stock

  @CreateDateColumn({ type: 'timestamptz' })
  start_at: Date

  @CreateDateColumn({ type: 'timestamptz' })
  end_at: Date

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date

  rating?: number
}
